export interface IPaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: (page?: string | number) => string;
}
