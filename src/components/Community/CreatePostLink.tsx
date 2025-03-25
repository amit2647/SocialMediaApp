"use client"; // Ensure this is a client component

import {
  Flex,
  Icon,
  Input,
  useColorModeValue,
  useTheme,
} from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { BsLink45Deg } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { IoImageOutline } from "react-icons/io5";

const CreatePostLink: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const theme = useTheme();

  const onClick = () => {
    const communityId = params.communityId as string;
    
    if (communityId) {
      router.push(`/${communityId}/submit`);
    } else {
      router.push("/createPost");
    }
  };

  // Fetch colors from the theme
  const bg = useColorModeValue(
    theme.colors.createPost.bgLight,
    theme.colors.createPost.bgDark
  );
  const borderColor = useColorModeValue(
    theme.colors.createPost.borderLight,
    theme.colors.createPost.borderDark
  );
  const placeholderColor = useColorModeValue(
    theme.colors.createPost.placeholderLight,
    theme.colors.createPost.placeholderDark
  );
  const inputBg = useColorModeValue(
    theme.colors.createPost.inputBgLight,
    theme.colors.createPost.inputBgDark
  );
  const iconColor = useColorModeValue(
    theme.colors.createPost.iconLight,
    theme.colors.createPost.iconDark
  );
  const focusBorder = theme.colors.createPost.focusBorder;

  return (
    <Flex
      justify="space-evenly"
      align="center"
      bg={bg}
      height="56px"
      borderRadius={4}
      border="1px solid"
      borderColor={borderColor}
      p={2}
      mb={4}
    >
      <Icon as={FaUserCircle} fontSize={36} color={borderColor} mr={4} />
      <Input
        placeholder="Create Post"
        fontSize="10pt"
        _placeholder={{ color: placeholderColor }}
        _hover={{
          bg: inputBg,
          border: "1px solid",
          borderColor: focusBorder,
        }}
        _focus={{
          outline: "none",
          bg: inputBg,
          border: "1px solid",
          borderColor: focusBorder,
        }}
        bg={inputBg}
        borderColor={borderColor}
        height="36px"
        borderRadius={4}
        mr={4}
        onClick={onClick}
      />
      <Icon
        as={IoImageOutline}
        fontSize={24}
        mr={4}
        color={iconColor}
        cursor="pointer"
      />
      <Icon as={BsLink45Deg} fontSize={24} color={iconColor} cursor="pointer" />
    </Flex>
  );
};

export default CreatePostLink;
