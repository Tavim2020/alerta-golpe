import { FieldErrors, FieldName, FieldValues } from "react-hook-form";
import {
  ErrorMessage,
  FieldValuesFromFieldErrors,
} from "@hookform/error-message";
import { IErrorMessageCustomProps } from ".";
import { ParagraphError } from "./components/paragraph-error";

export const ErrorMessageCustom = <GProps extends FieldValues>({
  errors,
  name,
}: IErrorMessageCustomProps<GProps>) => {
  return (
    <ErrorMessage
      errors={errors}
      name={
        name as unknown as FieldName<
          FieldValuesFromFieldErrors<FieldErrors<GProps>>
        >
      }
      render={({ message }) => <ParagraphError>{message}</ParagraphError>}
    />
  );
};
