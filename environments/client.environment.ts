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

export const CLIENT_ENVIRONMENT = envValidation.data;
