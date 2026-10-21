import { ILabelProps } from "./label.type";

export const Label = ({ htmlFor, children }: ILabelProps) => {
  if (!children) return null;

  return (
    <label htmlFor={htmlFor} className="font-semibold text-lg">
      {children}
    </label>
  );
};
