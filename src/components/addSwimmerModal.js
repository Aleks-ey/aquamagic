import { useState } from "react";
import { useRouter } from "next/router";

export default function AddSwimmerModal({ open, onClose, userId, onSuccess }) {
  const router = useRouter();
  const [mode, setMode] = useState("choose"); // "choose" | "claim"
  const [loading, setLoading] = useState(false);

  const [claim, setClaim] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
  });

  if (!open) return null;

  async function claimExisting() {
    setLoading(true);

    const res = await fetch("/api/claim-swimmer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, ...claim }),
    });

    const json = await res.json();
    setLoading(false);

    if (!res.ok) return alert(json.error || "No match found");

    onSuccess?.();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-lg font-semibold">Add Swimmer</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        <div className="px-5 py-5">
          {mode === "choose" ? (
            <div className="space-y-3">
              <button
                onClick={() => router.push("/registration")}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Register New Swimmer
              </button>

              <button
                onClick={() => setMode("claim")}
                className="w-full border py-2 rounded hover:bg-gray-50"
              >
                Add Existing Swimmer
              </button>

              <p className="text-xs text-gray-500 pt-2">
                “Add Existing” is for swimmers already registered who you want
                to link to this account.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Enter the swimmer’s first name, last name, and DOB exactly as
                used on registration.
              </p>

              <input
                className="border p-2 w-full rounded"
                placeholder="First Name"
                value={claim.first_name}
                onChange={(e) =>
                  setClaim({ ...claim, first_name: e.target.value })
                }
              />
              <input
                className="border p-2 w-full rounded"
                placeholder="Last Name"
                value={claim.last_name}
                onChange={(e) =>
                  setClaim({ ...claim, last_name: e.target.value })
                }
              />
              <input
                className="border p-2 w-full rounded"
                type="date"
                value={claim.date_of_birth}
                onChange={(e) =>
                  setClaim({ ...claim, date_of_birth: e.target.value })
                }
              />

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setMode("choose")}
                  className="w-full border py-2 rounded hover:bg-gray-50"
                >
                  Back
                </button>

                <button
                  onClick={claimExisting}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
                >
                  {loading ? "Working..." : "Add to Account"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
