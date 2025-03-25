import { auth } from "@/firebase/clientApp";
import {
  Box,
  Flex,
  Icon,
  useColorModeValue,
  useTheme,
  Text,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaUserCircle } from "react-icons/fa";

type UserProfileProps = {
  user?: User | null;
};

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const theme = useTheme();

  const bgColor = useColorModeValue(
    theme.colors.headerComponent.bgColor.light,
    theme.colors.headerComponent.bgColor.dark
  );
  const borderColor = useColorModeValue(
    theme.colors.headerComponent.borderColor.light,
    theme.colors.headerComponent.borderColor.dark
  );
  const iconColor = useColorModeValue(
    theme.colors.headerComponent.iconColor.light,
    theme.colors.headerComponent.iconColor.dark
  );
  const boxBgColor = useColorModeValue(
    theme.colors.headerComponent.boxBgColor.light,
    theme.colors.headerComponent.boxBgColor.dark
  );
  const textColor = useColorModeValue(
    theme.colors.headerComponent.textColor.light,
    theme.colors.headerComponent.textColor.dark
  );
  const subTextColor = useColorModeValue(
    theme.colors.headerComponent.subTextColor.light,
    theme.colors.headerComponent.subTextColor.dark
  );

  return (
    <Flex direction="column" width="100%" height="146px">
      <Box height="50%" bgColor={bgColor} />
      <Flex justifyContent="center" bg={boxBgColor} height="50%">
        <Flex width="95%" maxWidth="860px">
          <Icon
            as={FaUserCircle}
            fontSize={64}
            position="relative"
            top={-3}
            color={iconColor}
            border={`4px solid ${borderColor}`}
            borderRadius="50%"
          />
          <Flex padding="10px 16px">
            <Flex direction="column" mr={6}>
              <Text fontWeight={800} fontSize="16pt" color={textColor}>
                {user?.displayName || user?.email?.split("@")[0]}
              </Text>
              <Text fontWeight={600} fontSize="10pt" color={subTextColor}>
                {user?.email}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default UserProfile;
