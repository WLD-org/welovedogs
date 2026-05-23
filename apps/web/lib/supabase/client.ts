import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createMockSupabaseClient } from "@/lib/supabase/mock-client";

export function createClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();

  if (!supabaseUrl || !supabaseAnonKey) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "Missing Supabase environment variables. Please check your configuration. Using mock client."
      );
    }
    return createMockSupabaseClient() as ReturnType<typeof createBrowserClient>;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export { createClient as createBrowserClient };
