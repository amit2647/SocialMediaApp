import React, { useState } from "react";
import {
  Button,
  Flex,
  Icon,
  Stack,
  Text,
  useColorModeValue,
  useTheme,
} from "@chakra-ui/react";
import { FaUserCircle } from "react-icons/fa";
import CreateCommunityModal from "../Modal/CreateCommunity/CreateCommunityModal";
import { useRouter } from "next/navigation";

const PersonalHome: React.FC = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const router = useRouter();

  //  Use centralized theme values
  const bgColor = useColorModeValue(
    theme.colors.personalHome.bgColor.light,
    theme.colors.personalHome.bgColor.dark
  );
  const borderColor = useColorModeValue(
    theme.colors.personalHome.borderColor.light,
    theme.colors.personalHome.borderColor.dark
  );
  const textColor = useColorModeValue(
    theme.colors.personalHome.textColor.light,
    theme.colors.personalHome.textColor.dark
  );
  const subTextColor = useColorModeValue(
    theme.colors.personalHome.subTextColor.light,
    theme.colors.personalHome.subTextColor.dark
  );
  const buttonVariant = useColorModeValue(
    theme.colors.personalHome.buttonVariant.light,
    theme.colors.personalHome.buttonVariant.dark
  );
  const iconColor = useColorModeValue(
    theme.colors.personalHome.iconColor.light,
    theme.colors.personalHome.iconColor.dark
  );

  const onClick = () => {
    router.push(`/createPost`); // Redirect to a general submit page
  };

  return (
    <>
      <CreateCommunityModal open={open} handleClose={() => setOpen(false)} />
      <Flex
        direction="column"
        bg={bgColor}
        borderRadius={4}
        border="1px solid"
        borderColor={borderColor}
        position="sticky"
        maxWidth="320px"
      >
        <Flex
          align="flex-end"
          color="white"
          p="6px 10px"
          height="220px"
          borderRadius="4px 4px 0px 0px"
          fontWeight={600}
          bgGradient="linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75)), url('/images/Homepage.png')"
        />
        <Flex direction="column" p="12px">
          <Flex align="center" mb={2}>
            <Icon as={FaUserCircle} fontSize={40} color={iconColor} mr={2} />
            <Text fontWeight={600} color={textColor}>
              Home
            </Text>
          </Flex>
          <Stack spacing={3}>
            <Text fontSize="12pt" fontWeight={800} color={subTextColor}>
              Aurelius
            </Text>
            <Text fontSize="9pt" color={subTextColor}>
              mindful connection and growth .Share reflections, engage in meaningful discussions, and cultivate
              wisdom in a world of distractions.
            </Text>
            <Button height="30px" variant={buttonVariant} onClick={onClick}>
              Create Post
            </Button>
            <Button
              variant="outline"
              height="30px"
              onClick={() => setOpen(true)}
            >
              Create Community
            </Button>
          </Stack>
        </Flex>
      </Flex>
    </>
  );
};

export default PersonalHome;
