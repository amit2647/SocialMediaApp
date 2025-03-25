import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Box,
  Flex,
  Icon,
  Text,
  MenuDivider,
  useColorModeValue, // Import Dark Mode utility
} from "@chakra-ui/react";
import { signOut, User } from "firebase/auth";
import React from "react";
import { CgProfile } from "react-icons/cg";
import { MdOutlineLogin } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { VscAccount } from "react-icons/vsc";
import { auth } from "@/firebase/clientApp";
import { authModalState } from "@/atoms/authModalAtom";
import { useRecoilState, useResetRecoilState } from "recoil";
import { communityState } from "@/atoms/communitiesAtom";
import { useRouter } from "next/navigation";

type UserMenuProps = {
  user?: User | null;
};

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const resetCommunityState = useResetRecoilState(communityState);
  const [authModal, setModalState] = useRecoilState(authModalState);
  const router = useRouter();

  const logout = async () => {
    await signOut(auth);
    resetCommunityState();
  };

  const onClick = () => {
    router.push("/user");
  };

  // Dark Mode Styling
  const menuBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const hoverBg = useColorModeValue("#2c67b3", "gray.600");

  return (
    <Menu>
      <MenuButton
        cursor="pointer"
        padding="0px 6px"
        borderRadius={4}
        _hover={{ outline: "1px solid", outlineColor: "gray.500" }}
      >
        <Flex align="center">
          <Flex align="center">
            {user ? (
              <>
                <Icon
                  fontSize={24}
                  mr={1}
                  color={textColor}
                  as={FaUserCircle}
                />
                <Box
                  display={{ base: "none", lg: "flex" }}
                  flexDirection="column"
                  fontSize="8pt"
                  alignItems="flex-start"
                  mr={8}
                >
                  <Text fontWeight={700}>
                    {user?.displayName || user?.email?.split("@")[0]}
                  </Text>
                </Box>
              </>
            ) : (
              <Icon fontSize={24} color={textColor} mr={1} as={VscAccount} />
            )}
          </Flex>
          <ChevronDownIcon />
        </Flex>
      </MenuButton>
      <MenuList bg={menuBg}>
        {user ? (
          <>
            <MenuItem
              fontSize="10pt"
              fontWeight={700}
              _hover={{ bg: hoverBg, color: "white" }}
              onClick={onClick}
            >
              <Flex alignItems="center">
                <Icon fontSize={20} mr={2} as={CgProfile} />
                Profile
              </Flex>
            </MenuItem>
            <MenuDivider />
            <MenuItem
              fontSize="10pt"
              fontWeight={700}
              _hover={{ bg: hoverBg, color: "white" }}
              onClick={logout}
            >
              <Flex alignItems="center">
                <Icon fontSize={20} mr={2} as={MdOutlineLogin} />
                Log Out
              </Flex>
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem
              fontSize="10pt"
              fontWeight={700}
              _hover={{ bg: hoverBg, color: "white" }}
              onClick={() => setModalState({ open: true, view: "login" })}
            >
              <Flex alignItems="center">
                <Icon fontSize={20} mr={2} as={MdOutlineLogin} />
                Log In / Sign Up
              </Flex>
            </MenuItem>
          </>
        )}
      </MenuList>
    </Menu>
  );
};

export default UserMenu;
