import "@fontsource/open-sans/300.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/700.css";
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/700.css";
import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import { colors } from "./colors";
import { Button } from "./button";

const config: ThemeConfig = {
  initialColorMode: "system",
  useSystemColorMode: true,
};

export const theme = extendTheme({
  config,
  colors,
  fonts: {
    body: "Poppins, sans-serif",
    heading: "Open Sans, sans-serif",
  },
  styles: {
    global: {
      body: {
        bg: "background.light",
        color: "text.light",
        _dark: {
          bg: "background.dark",
          color: "text.dark",
        },
      },
    },
  },
  components: {
    Button,
  },
});
