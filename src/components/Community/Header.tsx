import React from "react";
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  Image,
  useColorModeValue,
  useTheme,
} from "@chakra-ui/react";
import { FaUserCircle } from "react-icons/fa";
import { Community } from "../../atoms/communitiesAtom";
import useCommunityData from "../../hooks/useCommunityData";

type HeaderProps = {
  communityData: Community;
};

const Header: React.FC<HeaderProps> = ({ communityData }) => {
  const theme = useTheme();
  const { communityStateValue, loading, onJoinOrLeaveCommunity } =
    useCommunityData(!!communityData);
  const isJoined = !!communityStateValue.mySnippets.find(
    (item) => item.communityId === communityData.id
  );

  //  Use centralized theme values
  const bgColor = useColorModeValue(
    theme.colors.headerComponent.bgColor.light,
    theme.colors.headerComponent.bgColor.dark
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
  const borderColor = useColorModeValue(
    theme.colors.headerComponent.borderColor.light,
    theme.colors.headerComponent.borderColor.dark
  );
  const iconColor = useColorModeValue(
    theme.colors.headerComponent.iconColor.light,
    theme.colors.headerComponent.iconColor.dark
  );
  return (
    <Flex direction="column" width="100%" height="146px">
      <Box height="50%" bg={bgColor} />
      <Flex justifyContent="center" bg={boxBgColor} height="50%">
        <Flex width="95%" maxWidth="860px">
          {communityStateValue.currentCommunity.imageURL ? (
            <Image
              borderRadius="full"
              boxSize="66px"
              src={communityStateValue.currentCommunity.imageURL}
              alt="Community Image"
              position="relative"
              top={-3}
              border={`4px solid ${borderColor}`}
            />
          ) : (
            <Icon
              as={FaUserCircle}
              fontSize={64}
              position="relative"
              top={-3}
              color={iconColor}
              border={`4px solid ${borderColor}`}
              borderRadius="50%"
            />
          )}
          <Flex padding="10px 16px">
            <Flex direction="column" mr={6}>
              <Text fontWeight={800} fontSize="16pt" color={textColor}>
                {communityData.id}
              </Text>
              <Text fontWeight={600} fontSize="10pt" color={subTextColor}>
                {communityData.id}
              </Text>
            </Flex>
            <Flex>
              <Button
                variant={isJoined ? "outline" : "solid"}
                height="30px"
                pr={6}
                pl={6}
                onClick={() => onJoinOrLeaveCommunity(communityData, isJoined)}
                isLoading={loading}
              >
                {isJoined ? "Joined" : "Join"}
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Header;
