import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SERVER_ENVIRONMENT } from "@/environments/server.environment";

const { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } =
  SERVER_ENVIRONMENT;

export function db(): SupabaseClient {
  return createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}
