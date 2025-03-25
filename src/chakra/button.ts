import { ComponentStyleConfig } from "@chakra-ui/theme";
import { mode } from "@chakra-ui/theme-tools";

export const Button: ComponentStyleConfig = {
  baseStyle: {
    borderRadius: "60px",
    fontSize: "10pt",
    fontWeight: 700,
    _focus: {
      boxShadow: "none",
    },
  },
  sizes: {
    sm: {
      fontSize: "8pt",
    },
    md: {
      fontSize: "10pt",
    },
  },
  variants: {
    solid: (props) => ({
      color: "white",
      bg: mode("#2c67b3", "#4d04cb")(props),
      _hover: {
        bg: mode("#99b8d4", "#2a0476")(props),
      },
    }),
    outline: (props) => ({
      color: mode("#2c67b3", "#4d04cb")(props),
      border: "1px solid",
      borderColor: mode("#2c67b3", "#4d04cb")(props),
      _hover: {
        bg: mode("gray.100", "gray.700")(props),
      },
    }),
    oauth: (props) => ({
      height: "34px",
      border: "1px solid",
      borderColor: mode("gray.300", "gray.500")(props),
      _hover: {
        bg: mode("gray.50", "gray.600")(props),
      },
    }),
  },
};

export default Button;
