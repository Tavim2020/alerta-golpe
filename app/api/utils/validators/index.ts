import { NextRequest } from "next/server";
import z from "zod";
import { ValidationError } from "@/utils/errors";

interface IValidateRequestData<GSchema extends z.ZodTypeAny> {
  schema: GSchema;
  req: NextRequest;
  formType?: "form-data" | "json";
}

export async function validateRequestData<GSchema extends z.ZodTypeAny>({
  schema,
  req,
  formType = "json",
}: IValidateRequestData<GSchema>): Promise<z.infer<GSchema>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let body: Record<string, any> = {};

  if (formType === "json") {
    body = await req.json();
  } else {
    const formData = await req.formData();

    formData.forEach((value, key) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let parsedValue: any = value;

      if (typeof value === "string") {
        if (value === "true") parsedValue = true;
        else if (value === "false") parsedValue = false;
      }
      body[key as keyof typeof body] = parsedValue;
    });
  }

  const validationResult = schema.safeParse(body);

  if (!validationResult.success)
    throw new ValidationError(z.treeifyError(validationResult.error).errors[0]);

  return validationResult.data;
}
