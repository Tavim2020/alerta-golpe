import { ButtonLink } from "@/components/buttons/button-link";
import { APP_ROUTE } from "@/routes/app.route";
import { ArrowBigLeft, ArrowLeftCircle } from "lucide-react";
import { IBackButtonProps } from "./back-button.type";

export const BackButton = ({ title, href }: IBackButtonProps) => {
  return (
    <div className="my-5 flex items-center gap-4">
      <ButtonLink variant="clean" href={href}>
        <ArrowLeftCircle className="w-8 h-8 text-black" />
      </ButtonLink>

      <h3 className="font-display text-2xl underline">{title}</h3>
    </div>
  );
};
