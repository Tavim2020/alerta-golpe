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
      className={[
        "flex flex-col items-center justify-center gap-5",
        "bg-background text-foreground",
        fullScreen ? "min-h-screen w-full" : "min-h-40 w-full",
      ].join(" ")}
    >
      <div className="relative flex size-14 items-center justify-center">
        <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-current/10 border-t-primary" />

        <div className="size-2.5 rounded-full bg-primary" />
      </div>

      <div className="flex flex-col items-center gap-1.5">
        <p className="text-sm font-medium tracking-wide">{message}</p>

        <p className="text-xs text-muted-foreground">Aguarde um instante</p>
      </div>

      <span className="sr-only">Carregando conteúdo</span>
    </div>
  );
}
