import { APP_INFO } from "@/constants/app.constant";
import { generateCurrentYear } from "@/utils/generate/dates";

export const Footer = () => {
  return (
    <footer className="mt-auto bg-ink px-4 py-8 text-center text-sm text-white/70">
      <p>
        Os relatos são de pessoas reais. Foi vítima de golpe? Registre um
        boletim de ocorrência.
      </p>
      <p className="mt-1">
        © {generateCurrentYear()} {APP_INFO.name}
      </p>
    </footer>
  );
};
