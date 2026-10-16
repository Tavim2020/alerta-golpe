import * as z from "zod";

const environmentSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url({ error: "NEXT_PUBLIC_SITE_URL é uma url" }),
  NEXT_PUBLIC_SUPABASE_URL: z.url({
    error: "NEXT_PUBLIC_SUPABASE_URL é uma url",
  }),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string({ error: "NEXT_PUBLIC_SUPABASE_ANON_KEY é uma string" })
    .regex(/^sb_publishable_/, {
      error: "NEXT_PUBLIC_SUPABASE_ANON_KEY deve começar com 'sb_publishable_'",
    }),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string({ error: "SUPABASE_SERVICE_ROLE_KEY é uma string" })
    .regex(/^sb_secret_/, {
      error: "SUPABASE_SERVICE_ROLE_KEY deve começar com 'sb_secret_'",
    }),

  ADMIN_EMAIL: z.email({ error: "ADMIN_EMAIL é um email válido" }),
  ADMIN_PASSWORD: z.string({ error: "ADMIN_PASSWORD é uma string" }),

  AUTH_SECRET: z.uuidv4({ error: "AUTH_SECRET é um uuidv4" }),

  NEXT_PUBLIC_ADSENSE_CLIENT: z
    .string({ error: "NEXT_PUBLIC_ADSENSE_CLIENT é uma string" })
    .regex(/ca-pub-/, {
      error: "NEXT_PUBLIC_ADSENSE_CLIENT deve começar com 'ca-pub'",
    }),
  NEXT_PUBLIC_ADSENSE_SLOT: z
    .string({
      error: "NEXT_PUBLIC_ADSENSE_SLOT é uma string",
    })
    .regex(/^[0-9]/, { error: "NEXT_PUBLIC_ADSENSE_SLOT é apenas números" }),
});

const allEnvironmentVariables = {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  AUTH_SECRET: process.env.AUTH_SECRET,
  NEXT_PUBLIC_ADSENSE_CLIENT: process.env.NEXT_PUBLIC_ADSENSE_CLIENT,
  NEXT_PUBLIC_ADSENSE_SLOT: process.env.NEXT_PUBLIC_ADSENSE_SLOT,
};

const envValidation = environmentSchema.safeParse(allEnvironmentVariables);

if (!envValidation.success) {
  const error = z.flattenError(envValidation.error);
  console.error("Environment variables is not valid");
  console.table(
    Object.entries(error.fieldErrors).map(([key, value]) => ({
      key,
      value,
    })),
  );
  throw new Error("Environment variables is not valid");
}

export const SERVER_ENVIRONMENT = envValidation.data;
