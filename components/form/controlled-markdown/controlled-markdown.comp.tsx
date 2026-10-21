"use client";

import { Controller, FieldValues } from "react-hook-form";
import { IControlledMarkdown } from "./controlled-markdown.type";
import { cn } from "@/libs/utils";
import { ErrorMessageCustom } from "../error-message-custom";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import { Label } from "../label";

export const ControlledMarkdown = <GProps extends FieldValues>({
  name,
  control,
  wrapperClassName,
  placeholder,
  label,
  markdownClassName,
  disabled,
  minLength,
  maxLength,
  required,
}: IControlledMarkdown<GProps>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, formState: { errors } }) => (
        <div className={cn("w-full", wrapperClassName)}>
          <Label htmlFor={name}>{label}</Label>

          <MDEditor
            {...field}
            textareaProps={{
              name,
              placeholder,
              disabled,
              minLength,
              maxLength,
              required,
            }}
            previewOptions={{
              rehypePlugins: [[rehypeSanitize]],
            }}
            id={name}
            className={cn(
              "w-full border border-ink/30 p-3 min-h-150",
              markdownClassName,
            )}
          />

          <ErrorMessageCustom errors={errors} name={name} />
        </div>
      )}
    />
  );
};
