import { ITipCardProps } from "./tip-card.type";

export const TipCard = ({ title, description }: ITipCardProps) => {
  return (
    <li className="border-l-8 border-sun bg-white p-4">
      <h2 className="font-bold">{title}</h2>
      <p className="mt-1 text-sm text-ink/70">{description}</p>
    </li>
  );
};
