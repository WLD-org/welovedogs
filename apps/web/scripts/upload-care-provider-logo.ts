import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const ROOT = path.resolve(__dirname, "../../..");

function loadEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

async function main() {
  const [, , slug, providerEmail] = process.argv;
  if (!slug || !providerEmail) {
    console.error(
      "Usage: npx tsx scripts/upload-care-provider-logo.ts <slug> <provider-email>"
    );
    process.exit(1);
  }

  loadEnvFile(path.join(ROOT, ".env"));

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase URL or key in environment");
  }

  const filePath = path.resolve(__dirname, `../public/images/care-providers/${slug}.png`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Logo file not found: ${filePath}`);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const storagePath = `seed/care-providers/${slug}.png`;
  const body = fs.readFileSync(filePath);

  const { error: uploadError } = await supabase.storage
    .from("profile-photos")
    .upload(storagePath, body, { contentType: "image/png", upsert: true });

  if (uploadError) throw uploadError;

  const { data: publicData } = supabase.storage.from("profile-photos").getPublicUrl(storagePath);
  const photoUrl = publicData.publicUrl;

  const { data, error } = await supabase
    .from("care_providers")
    .update({ profile_photo: photoUrl })
    .eq("email", providerEmail)
    .select("id, name, profile_photo");

  if (error) throw error;

  console.log(JSON.stringify({ photoUrl, updated: data }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
