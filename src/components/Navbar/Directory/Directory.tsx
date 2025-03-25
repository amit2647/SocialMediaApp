import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  Image,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import useDirectory from "@/hooks/useDirectory";
import Communities from "./Communities";

const UserMenu: React.FC = () => {
  const { directoryState, toggleMenuOpen } = useDirectory();

  // Fetch colors from theme
  const iconColor = useColorModeValue(
    "userMenu.iconLight",
    "userMenu.iconDark"
  );
  const hoverBorderColor = useColorModeValue(
    "userMenu.hoverBorderLight",
    "userMenu.hoverBorderDark"
  );
  const chevronColor = useColorModeValue(
    "userMenu.chevronLight",
    "userMenu.chevronDark"
  );

  return (
    <Menu isOpen={directoryState.isOpen}>
      {({ isOpen }) => (
        <>
          <MenuButton
            cursor="pointer"
            padding="0px 6px"
            borderRadius="4px"
            _hover={{ outline: "1px solid", outlineColor: hoverBorderColor }}
            mr={2}
            ml={{ base: 0, md: 2 }}
            onClick={toggleMenuOpen}
          >
            <Flex
              alignItems="center"
              justifyContent="space-between"
              width={{ base: "auto", lg: "200px" }}
            >
              <Flex alignItems="center">
                {directoryState.selectedMenuItem.imageURL ? (
                  <Image
                    borderRadius="full"
                    boxSize="24px"
                    src={directoryState.selectedMenuItem.imageURL}
                    mr={2}
                  />
                ) : (
                  <Icon
                    as={directoryState.selectedMenuItem.icon}
                    fontSize={24}
                    mr={{ base: 1, md: 2 }}
                    color={iconColor}
                  />
                )}
                <Box
                  display={{ base: "none", lg: "flex" }}
                  flexDirection="column"
                  fontSize="9pt"
                >
                  <Text fontWeight={600}>
                    {directoryState.selectedMenuItem.displayText}
                  </Text>
                </Box>
              </Flex>
              <ChevronDownIcon color={chevronColor} />
            </Flex>
          </MenuButton>
          <MenuList maxHeight="300px" overflow="scroll" overflowX="hidden">
            <Communities menuOpen={isOpen} />
          </MenuList>
        </>
      )}
    </Menu>
  );
};

export default UserMenu;
