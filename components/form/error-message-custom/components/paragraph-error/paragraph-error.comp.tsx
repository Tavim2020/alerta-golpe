import { IParagraphErrorProps } from "./paragraph-error.type";

export const ParagraphError = ({ children }: IParagraphErrorProps) => {
  return <p className="mt-2 text-[.625rem] text-red-500">{children}</p>;
};
