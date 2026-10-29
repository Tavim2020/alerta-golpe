type LoadingProps = {
  message?: string;
  fullScreen?: boolean;
};

export default function Loading({
  message = "Carregando...",
  fullScreen = true,
}: LoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={[
        "flex w-full flex-col items-center justify-center",
        "bg-background px-6 text-foreground",
        fullScreen ? "min-h-screen" : "min-h-64",
      ].join(" ")}
    >
      {/* Logo / Loading indicator */}
      <div className="relative mb-7 flex size-16 items-center justify-center">
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-primary/10 border-t-primary" />

        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className="size-7 text-primary"
        >
          <path
            d="M12 3 19 6V11.5C19 15.7 16.2 19 12 21C7.8 19 5 15.7 5 11.5V6L12 3Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="m9 12 2 2 4-4"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Text */}
      <div className="flex max-w-md flex-col items-center gap-2 text-center">
        <h2 className="text-base font-semibold tracking-tight">{message}</h2>

        <p className="text-sm text-muted-foreground">
          Aguarde um instante enquanto preparamos tudo.
        </p>
      </div>

      {/* Subtle progress indicator */}
      <div
        aria-hidden="true"
        className="mt-7 h-1 w-32 overflow-hidden rounded-full bg-muted"
      >
        <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
      </div>

      <span className="sr-only">Carregando conteúdo</span>
    </div>
  );
}
