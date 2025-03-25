"use client";

import Layout from "@/components/Layout/Layout";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { theme } from "@/chakra/theme";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      </head>
      <body suppressHydrationWarning={true}>
        <ChakraProvider theme={theme}>
          <Layout>{children}</Layout>
        </ChakraProvider>
      </body>
    </html>
  );
}
