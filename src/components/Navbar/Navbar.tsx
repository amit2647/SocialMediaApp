import { Flex, Image, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import SearchInput from "./SearchInput";
import RighContent from "./RightContent/RighContent";
import { auth } from "@/firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { defaultMenuItem } from "../../atoms/directoryMenuAtom";
import Directory from "./Directory/Directory";
import useDirectory from "@/hooks/useDirectory";
import DarkModeToggle from "./ThemeButton/DarkModeToggle";

const Navbar: React.FC = () => {
  const [user] = useAuthState(auth);
  const { onSelectMenuItem } = useDirectory();

  const navbarBg = useColorModeValue("navbar.light", "navbar.dark");
  const logoSrc = useColorModeValue(
    "/images/accessionerLogoWhite.png",
    "/images/accessionerLogo.png"
  );

  return (
    <Flex
      bg={navbarBg}
      height="44px"
      px={3}
      justify={{ md: "space-between" }}
      align="center"
      boxShadow="md"
    >
      <Flex
        align="center"
        cursor="pointer"
        onClick={() => onSelectMenuItem(defaultMenuItem)}
      >
        <Image src={logoSrc} ml={8} mr={4} height="34px" alt="Logo" />
      </Flex>
      {user && <Directory />}
      <SearchInput user={user} />
      <RighContent user={user} />
      <DarkModeToggle />
    </Flex>
  );
};

export default Navbar;
