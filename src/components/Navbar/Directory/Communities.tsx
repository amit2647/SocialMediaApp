import { communityState } from "@/atoms/communitiesAtom";
import CreateCommunityModal from "@/components/Modal/CreateCommunity/CreateCommunityModal";
import {
  Box,
  Flex,
  Icon,
  MenuItem,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { GrAdd } from "react-icons/gr";
import { useRecoilValue } from "recoil";
import MenuListItem from "./MenuListItem";

type CommunitiesProps = {
  menuOpen: boolean;
};

const Communities: React.FC<CommunitiesProps> = ({ menuOpen }) => {
  const [open, setOpen] = useState(false);
  const mySnippets = useRecoilValue(communityState).mySnippets;

  // Fetch colors from theme
  const hoverBg = useColorModeValue(
    "communities.hoverBgLight",
    "communities.hoverBgDark"
  );
  const textColor = useColorModeValue(
    "communities.textLight",
    "communities.textDark"
  );
  const moderatorTextColor = "communities.moderatorText";
  const iconColor = "communities.iconDefault";

  return (
    <>
      <CreateCommunityModal open={open} handleClose={() => setOpen(false)} />

      {mySnippets.find((item) => item.isModerator) && (
        <Box mt={3} mb={4}>
          <Text
            pl={3}
            mb={1}
            fontSize="7pt"
            fontWeight={500}
            color={moderatorTextColor}
          >
            MODERATING
          </Text>
          {mySnippets
            .filter((item) => item.isModerator)
            .map((snippet) => (
              <MenuListItem
                key={snippet.communityId}
                displayText={`${snippet.communityId}`}
                link={`/${snippet.communityId}`}
                icon={FaUserCircle}
                iconColor={iconColor}
              />
            ))}
        </Box>
      )}

      <Box mt={3} mb={4}>
        <Text
          pl={3}
          mb={1}
          fontSize="7pt"
          fontWeight={500}
          color={moderatorTextColor}
        >
          MY COMMUNITIES
        </Text>

        {/* Create Community Button */}
        <MenuItem
          width="100%"
          fontSize="9pt"
          color={textColor}
          _hover={{ bg: hoverBg }}
          onClick={() => setOpen(true)}
        >
          <Flex alignItems="center">
            <Icon fontSize={20} mr={2} as={GrAdd} />
            Create Community
          </Flex>
        </MenuItem>

        {mySnippets.map((snippet) => (
          <MenuListItem
            key={snippet.communityId}
            icon={FaUserCircle}
            displayText={`${snippet.communityId}`}
            link={`/${snippet.communityId}`}
            iconColor={iconColor}
            imageURL={snippet.imageURL}
          />
        ))}
      </Box>
    </>
  );
};

export default Communities;
