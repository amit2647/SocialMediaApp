import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  useColorModeValue,
  useTheme,
} from "@chakra-ui/react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Community } from "../../atoms/communitiesAtom";
import { firestore } from "../../firebase/clientApp";
import useCommunityData from "../../hooks/useCommunityData";

const Recommendations: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const { communityStateValue, onJoinOrLeaveCommunity } = useCommunityData();
  const theme = useTheme();

  const getCommunityRecommendations = async () => {
    setLoading(true);
    try {
      const communityQuery = query(
        collection(firestore, "communities"),
        orderBy("numberOfMembers", "desc"),
        limit(5)
      );
      const communityDocs = await getDocs(communityQuery);
      const communities = communityDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Community[];
      setCommunities(communities);
    } catch (error: any) {
      console.error("Error fetching communities:", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getCommunityRecommendations();
  }, []);

  //  Use centralized theme values
  const bgColor = useColorModeValue(
    theme.colors.recommendations.bgColor.light,
    theme.colors.recommendations.bgColor.dark
  );
  const borderColor = useColorModeValue(
    theme.colors.recommendations.borderColor.light,
    theme.colors.recommendations.borderColor.dark
  );
  const textColor = useColorModeValue(
    theme.colors.recommendations.textColor.light,
    theme.colors.recommendations.textColor.dark
  );
  const buttonVariant = useColorModeValue(
    theme.colors.recommendations.buttonVariant.light,
    theme.colors.recommendations.buttonVariant.dark
  );
  const iconColor = useColorModeValue(
    theme.colors.recommendations.iconColor.light,
    theme.colors.recommendations.iconColor.dark
  );

  return (
    <Flex
      direction="column"
      bg={bgColor}
      borderRadius={4}
      border="1px solid"
      borderColor={borderColor}
    >
      <Flex
        align="flex-end"
        color="white"
        p="6px 10px"
        height="150px"
        borderRadius="4px 4px 0px 0px"
        fontWeight={600}
        bgGradient="linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75)), url('/images/TopCommunities.png')"
      >
        Top Communities
      </Flex>
      <Flex direction="column">
        {loading ? (
          <Stack mt={2} p={3}>
            {[...Array(3)].map((_, index) => (
              <Flex key={index} justify="space-between" align="center">
                <SkeletonCircle size="10" />
                <Skeleton height="10px" width="70%" />
              </Flex>
            ))}
          </Stack>
        ) : (
          <>
            {communities.map((item, index) => {
              const isJoined = !!communityStateValue.mySnippets.find(
                (snippet) => snippet.communityId === item.id
              );
              return (
                <Link key={item.id} href={`/${item.id}`}>
                  <Flex
                    position="relative"
                    align="center"
                    fontSize="9pt"
                    borderBottom="1px solid"
                    borderColor={borderColor}
                    p="10px 12px"
                    fontWeight={600}
                  >
                    <Flex width="80%" align="center">
                      <Flex width="15%">
                        <Text mr={2} color={textColor}>
                          {index + 1}
                        </Text>
                      </Flex>
                      <Flex align="center" width="80%">
                        {item.imageURL ? (
                          <Image
                            borderRadius="full"
                            boxSize="28px"
                            src={item.imageURL}
                            mr={2}
                          />
                        ) : (
                          <Icon
                            as={FaUserCircle}
                            fontSize={30}
                            color={iconColor}
                            mr={2}
                          />
                        )}
                        <Text
                          whiteSpace="nowrap"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          color={textColor}
                        >
                          {item.id}
                        </Text>
                      </Flex>
                    </Flex>
                    <Box position="absolute" right="10px">
                      <Button
                        height="22px"
                        fontSize="8pt"
                        onClick={(event) => {
                          event.stopPropagation();
                          onJoinOrLeaveCommunity(item, isJoined);
                        }}
                        variant={isJoined ? "outline" : buttonVariant}
                      >
                        {isJoined ? "Joined" : "Join"}
                      </Button>
                    </Box>
                  </Flex>
                </Link>
              );
            })}
            <Box p="10px 20px">
              <Button height="30px" width="100%">
                View All
              </Button>
            </Box>
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default Recommendations;
