import { ReactNode } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { IInputFileProps } from "./components/input-file/input-file.type";

export interface IControlledFile<GProps extends FieldValues> extends Omit<
  IInputFileProps<GProps>,
  "field" | "errors"
> {
  control: Control<GProps>;
}
