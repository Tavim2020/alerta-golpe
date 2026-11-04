import { APP_ROUTE } from "@/routes/app.route";
import { ButtonLink } from "@/components/buttons/button-link";

export const AlertHits = () => {
  return (
    <section className="bg-sun">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <h1 className="max-w-3xl font-display text-5xl leading-[1.05] sm:text-7xl">
          Esses golpes já aconteceram. Não deixe que o próximo seja com você.
        </h1>

        <p className="mt-5 max-w-xl text-lg">
          Vídeos reais de pessoas que caíram em golpes. Veja como os criminosos
          agem e proteja sua família.
        </p>

        <ButtonLink href={APP_ROUTE.FRAUDS.ROOT()} className="mt-8">
          Ver golpes sofridos
        </ButtonLink>
      </div>

      <div className="hazard" />
    </section>
  );
};
