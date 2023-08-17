"use client";

// Imports
// ========================================================
import QueryProvider from "./query";

// Root Provider
// ========================================================
const RootProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <QueryProvider>{children}</QueryProvider>
    </>
  );
};

// Exports
// ========================================================
export default RootProvider;
