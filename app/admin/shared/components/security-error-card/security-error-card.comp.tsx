import { ISecurityErrorCardProps } from "./security-error-card.type";

export const SecurityErrorCard = ({ refetch }: ISecurityErrorCardProps) => {
  return (
    <div className="space-y-3 border border-red-200 bg-white p-6">
      <p className="text-sm text-red-600">
        Não foi possível carregar a listagem.
      </p>

      <button
        type="button"
        onClick={() => refetch()}
        className="border border-ink/20 px-4 py-2 text-sm transition hover:bg-ink/5"
      >
        Tentar novamente
      </button>
    </div>
  );
};
