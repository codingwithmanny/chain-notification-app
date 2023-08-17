"use client";

// Imports
// ========================================================
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

// Config
// ========================================================
const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

// Main Layout Component
// ========================================================
export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
