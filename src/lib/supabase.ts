import { createClient } from "@supabase/supabase-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ─── Server-side client (for API routes and server components) ──
export const supabaseServer = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: false,
    },
  }
);

// ─── Browser client factory ─────────────────────────────────────
export const createBrowserClient = () => createClientComponentClient();

// ─── Admin client (service role - server only) ──────────────────
export const createAdminClient = () =>
  createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

// ─── Storage helpers ─────────────────────────────────────────────
export const STORAGE_BUCKET = "blog-images";

export async function uploadImage(
  file: File,
  path: string,
  client: ReturnType<typeof createClientComponentClient>
): Promise<string | null> {
  const { data, error } = await client.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { upsert: true });

  if (error) {
    console.error("Upload error:", error);
    return null;
  }

  const {
    data: { publicUrl },
  } = client.storage.from(STORAGE_BUCKET).getPublicUrl(data.path);

  return publicUrl;
}

export async function deleteImage(
  path: string,
  client: ReturnType<typeof createClientComponentClient>
): Promise<boolean> {
  const { error } = await client.storage.from(STORAGE_BUCKET).remove([path]);
  return !error;
}
