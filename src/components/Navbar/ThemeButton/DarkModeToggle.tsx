"use client";

import { IconButton, useColorMode, useTheme } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { themeAtom } from "@/atoms/themeAtom";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

const DarkModeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [theme, setTheme] = useRecoilState(themeAtom);
  const chakraTheme = useTheme();

  // Fetch theme colors
  const bg =
    colorMode === "light"
      ? chakraTheme.colors.darkModeToggle.bgLight
      : chakraTheme.colors.darkModeToggle.bgDark;
  const hoverBg =
    colorMode === "light"
      ? chakraTheme.colors.darkModeToggle.hoverBgLight
      : chakraTheme.colors.darkModeToggle.hoverBgDark;
  const activeBg =
    colorMode === "light"
      ? chakraTheme.colors.darkModeToggle.activeBgLight
      : chakraTheme.colors.darkModeToggle.activeBgDark;

  const handleToggle = () => {
    toggleColorMode();
    setTheme(colorMode === "light" ? "dark" : "light");
  };

  return (
    <IconButton
      aria-label="Toggle dark mode"
      icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
      onClick={handleToggle}
      size="sm"
      variant="ghost"
      borderRadius={10}
      bg={bg}
      _hover={{ bg: hoverBg }}
      _active={{ bg: activeBg }}
      ml={4}
      mr={8}
    />
  );
};

export default DarkModeToggle;
