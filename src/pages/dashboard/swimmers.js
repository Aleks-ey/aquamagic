// /pages/dashboard/swimmers.js
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";
import { useAuth } from "../../utils/AuthContext";
import AddSwimmerModal from "../../components/addSwimmerModal";

export default function SwimmersPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [openAdd, setOpenAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [swimmers, setSwimmers] = useState([]);
  const [error, setError] = useState("");

  // Redirect if not signed in
  useEffect(() => {
    if (user === null) return;
    if (!user) router.push("/auth/signin");
  }, [user, router]);

  async function fetchSwimmers() {
    if (!user) return;

    setLoading(true);
    setError("");

    try {
      const { data: links, error: linksError } = await supabase
        .from("swimmer_accounts")
        .select("registrant_id")
        .eq("user_id", user.id);

      if (linksError) throw linksError;

      const ids = (links || []).map((x) => x.registrant_id);

      if (ids.length === 0) {
        setSwimmers([]);
        return;
      }

      const { data: registrants, error: regError } = await supabase
        .from("registrants")
        .select("registrant_id, first_name, last_name, date_of_birth")
        .in("registrant_id", ids)
        .order("last_name", { ascending: true });

      if (regError) throw regError;

      setSwimmers(registrants || []);
    } catch (e) {
      console.error(e);
      setError("Could not load swimmers. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) fetchSwimmers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const hasSwimmers = useMemo(() => swimmers.length > 0, [swimmers]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-20">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Back arrow */}
            <button
              onClick={() => router.push("/dashboard")}
              className="text-blue-600 hover:text-blue-800"
              title="Back to dashboard"
            >
              ←
            </button>

            <h1 className="text-3xl font-bold">Swimmers</h1>
          </div>

          {/* Plus button */}
          <button
            onClick={() => setOpenAdd(true)}
            className="w-10 h-10 rounded-full bg-blue-600 text-white text-2xl flex items-center justify-center hover:bg-blue-700"
            title="Add swimmer"
          >
            +
          </button>
        </div>

        {loading && <div className="text-gray-600">Loading swimmers…</div>}

        {!loading && error && <div className="text-red-600">{error}</div>}

        {!loading && !error && !hasSwimmers && (
          <div className="bg-white border rounded-lg p-6">
            <p className="text-gray-700">
              No swimmers found on your account yet.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Click the <span className="font-semibold">+</span> button to
              register a new swimmer or add an existing registration to your
              account.
            </p>
          </div>
        )}

        {!loading && !error && hasSwimmers && (
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 font-semibold text-sm bg-gray-50 border-b px-4 py-3">
              <div className="col-span-6">Name</div>
              <div className="col-span-3">DOB</div>
              <div className="col-span-3 text-right">Actions</div>
            </div>

            {swimmers.map((s) => (
              <div
                key={s.registrant_id}
                className="grid grid-cols-12 px-4 py-3 border-b items-center"
              >
                <div className="col-span-6">
                  {s.first_name} {s.last_name}
                </div>

                <div className="col-span-3 text-gray-600 text-sm">
                  {s.date_of_birth || "—"}
                </div>

                <div className="col-span-3 flex justify-end gap-2">
                  <button
                    onClick={() =>
                      router.push(`/dashboard/swimmers/${s.registrant_id}`)
                    }
                    className="px-3 py-1 rounded border hover:bg-gray-50"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add swimmer modal */}
        <AddSwimmerModal
          open={openAdd}
          onClose={() => setOpenAdd(false)}
          userId={user.id}
          onSuccess={fetchSwimmers}
        />
      </div>
    </div>
  );
}
