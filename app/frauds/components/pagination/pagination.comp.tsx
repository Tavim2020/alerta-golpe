import Link from "next/link";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { IPaginationProps } from "./pagination.type";

export const Pagination = ({
  currentPage,
  totalPages,
  basePath,
}: IPaginationProps) => {
  if (totalPages <= 1) return null;

  const getPageHref = (page: number) =>
    page === 1 ? basePath : `${basePath}?page=${page}`;

  const getPages = () => {
    const pages = new Set<number>();

    pages.add(1);
    pages.add(totalPages);

    for (
      let page = Math.max(1, currentPage - 2);
      page <= Math.min(totalPages, currentPage + 2);
      page++
    ) {
      pages.add(page);
    }

    return [...pages].sort((a, b) => a - b);
  };

  const pages = getPages();

  const getEllipsisTarget = (index: number) => {
    const previousPage = pages[index - 1];
    const nextPage = pages[index + 1];

    return Math.floor((previousPage + nextPage) / 2);
  };

  const linkClass =
    "inline-flex size-10 shrink-0 items-center justify-center border text-sm font-semibold transition";

  const inactiveClass = "border-ink/15 hover:border-ink hover:bg-ink/5";

  return (
    <nav
      aria-label="Paginação dos vídeos"
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
    >
      {currentPage > 1 && (
        <Link
          href={getPageHref(currentPage - 1)}
          aria-label="Página anterior"
          className={`${linkClass} ${inactiveClass}`}
          scroll={false}
        >
          <ChevronLeft className="size-5" />
        </Link>
      )}

      {pages.map((page, index) => {
        const previousPage = pages[index - 1];
        const hasGap = previousPage !== undefined && page - previousPage > 1;

        return (
          <span key={page} className="contents">
            {hasGap && (
              <Link
                href={getPageHref(getEllipsisTarget(index - 1))}
                aria-label={`Avançar para páginas entre ${previousPage} e ${page}`}
                className={`${linkClass} ${inactiveClass}`}
                scroll={false}
              >
                <MoreHorizontal className="size-5" />
              </Link>
            )}

            <Link
              href={getPageHref(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={`${linkClass} ${
                page === currentPage
                  ? "border-ink bg-ink text-sun"
                  : inactiveClass
              }`}
              scroll={false}
            >
              {page}
            </Link>
          </span>
        );
      })}

      {currentPage < totalPages && (
        <Link
          href={getPageHref(currentPage + 1)}
          aria-label="Próxima página"
          className={`${linkClass} ${inactiveClass}`}
          scroll={false}
        >
          <ChevronRight className="size-5" />
        </Link>
      )}
    </nav>
  );
};
