import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { user_id, first_name, last_name, date_of_birth } = req.body;

  if (!user_id || !first_name || !last_name || !date_of_birth) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Find a matching registrant (case-insensitive match for names)
  const { data: match, error } = await supabaseAdmin
    .from("registrants")
    .select("registrant_id")
    .ilike("first_name", first_name.trim())
    .ilike("last_name", last_name.trim())
    .eq("date_of_birth", date_of_birth)
    .limit(1)
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });
  if (!match)
    return res.status(404).json({ error: "No matching swimmer found" });

  // Link swimmer to account
  const { error: linkError } = await supabaseAdmin
    .from("swimmer_accounts")
    .insert({
      user_id,
      registrant_id: match.registrant_id,
    });

  if (linkError) {
    // If it’s already linked, treat it as success (optional)
    const msg = String(linkError.message || "").toLowerCase();
    if (msg.includes("duplicate") || msg.includes("unique")) {
      return res
        .status(200)
        .json({ registrant_id: match.registrant_id, alreadyLinked: true });
    }
    return res.status(500).json({ error: linkError.message });
  }

  return res.status(200).json({ registrant_id: match.registrant_id });
}
