import React from "react";
import { IShowTipProps } from "./show-tip.type";

export const ShowTip = ({ title, description }: IShowTipProps) => {
  return (
    <li className="border-l-8 border-sun bg-white p-4">
      <h2 className="font-bold">{title}</h2>
      <p className="mt-1 text-sm text-ink/70">{description}</p>
    </li>
  );
};
