"use client";

import { ChakraProvider } from "@chakra-ui/react";
import Navbar from "@/components/Navbar/Navbar";
import { RecoilRoot } from "recoil";
import { theme } from "@/chakra/theme";
import { useEffect, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevents mismatches by delaying render
  
  return (
    <RecoilRoot>
      <ChakraProvider theme={theme}>
        <Navbar />
        <main>{children}</main>
      </ChakraProvider>
    </RecoilRoot>
  );
}
