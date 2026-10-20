"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { IQueryProviderProps } from "./query-provider.type";

const queryClient = new QueryClient();

export const QueryProvider = ({ children }: IQueryProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
