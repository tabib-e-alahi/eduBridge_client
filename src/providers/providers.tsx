"use client";

import { ThemeProvider } from "@/components/theme-provider";
import QueryProvider from "./QueryProvider";
import ReduxProvider from "./ReduxProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <QueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </QueryProvider>
    </ReduxProvider>
  );
}
