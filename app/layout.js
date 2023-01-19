"use client";

import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export default function RootLayout({ children }) {
  return (
    <html>
      <head />
      <QueryClientProvider client={queryClient} contextSharing={true}>
        <body>{children}</body>
      </QueryClientProvider>
    </html>
  );
}
