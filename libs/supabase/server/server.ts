import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SERVER_ENVIRONMENT } from "@/environments/server.environment";
import { Database } from "@/libs/supabase/types/database.type";

const { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } =
  SERVER_ENVIRONMENT;

export function db(): SupabaseClient<Database> {
  return createClient<Database>(
    NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}
