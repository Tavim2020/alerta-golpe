import { IPreventionTipProps } from "./prevention-tip.type";

export const PreventionTip = ({
  index,
  title,
  description,
}: IPreventionTipProps) => {
  return (
    <li className="flex gap-3 rounded-lg border border-ink/10 p-4">
      <span
        className="grid size-7 shrink-0 place-items-center rounded-full bg-sun text-sm font-bold"
        aria-hidden="true"
      >
        {index + 1}
      </span>

      <div className="min-w-0">
        <h3 className="font-bold leading-snug text-ink">{title}</h3>

        <p className="mt-1 leading-relaxed text-ink/80">{description}</p>
      </div>
    </li>
  );
};
