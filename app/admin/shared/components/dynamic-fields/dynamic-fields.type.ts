import { JSX, MouseEventHandler } from "react";
import {
  FieldError,
  FieldErrorsImpl,
  FieldValues,
  Merge,
  UseFieldArrayRemove,
} from "react-hook-form";

export interface IDynamicFieldsProps<GFields extends FieldValues> {
  title: string;
  addButton: {
    title: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
  };
  fields: (GFields &
    Record<"id", string> & {
      disabled?: boolean;
    })[];
  remove: UseFieldArrayRemove;
  render: (index: number) => JSX.Element;
  fieldError:
    | Merge<
        FieldError,
        (Merge<FieldError, FieldErrorsImpl<GFields>> | undefined)[]
      >
    | undefined;
}
