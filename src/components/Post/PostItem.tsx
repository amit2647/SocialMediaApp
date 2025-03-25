"use client";

import { Post } from "@/atoms/postsAtom";
import {
  Flex,
  Icon,
  Skeleton,
  Image,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
  useTheme,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BsChat } from "react-icons/bs";
import moment from "moment";
import { FaUserCircle } from "react-icons/fa";
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoBookmarkOutline,
} from "react-icons/io5";
import router from "next/router";

type PostItemProps = {
  post: Post;
  userIsCreator?: boolean;
  userVoteValue?: number;
  onVote: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    vote: number,
    communityId: string,
    postIdx?: number
  ) => void;
  postIdx?: number;
  homePage?: boolean;
  onSelectPost?: (post: Post, postIdx: number) => void;
  onDeletePost: (post: Post) => Promise<boolean>;
};

const PostItem: React.FC<PostItemProps> = ({
  post,
  postIdx,
  userIsCreator,
  userVoteValue,
  onVote,
  homePage,
  onSelectPost,
  onDeletePost,
}) => {
  const theme = useTheme();
  const [loadingImage, setLoadingImage] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const singlePostView = !onSelectPost;

  const bg = useColorModeValue(
    theme.colors.postItem.bgLight,
    theme.colors.postItem.bgDark
  );
  const borderColor = useColorModeValue(
    theme.colors.postItem.borderColorLight,
    theme.colors.postItem.borderColorDark
  );
  const hoverBorderColor = useColorModeValue(
    theme.colors.postItem.hoverBorderColor,
    theme.colors.postItem.hoverBorderColor
  );
  const iconColor = useColorModeValue(
    theme.colors.postItem.iconColorLight,
    theme.colors.postItem.iconColorDark
  );
  const iconActiveColor = useColorModeValue(
    theme.colors.postItem.iconActiveColorLight,
    theme.colors.postItem.iconActiveColorDark
  );
  const textColor = useColorModeValue(
    theme.colors.postItem.textColorLight,
    theme.colors.postItem.textColorDark
  );
  const hoverBg = useColorModeValue(
    theme.colors.postItem.hoverBgLight,
    theme.colors.postItem.hoverBgDark
  );

  const handleDelete = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setLoadingDelete(true);
    try {
      const success = await onDeletePost(post);
      if (!success) throw new Error("Failed to delete post");

      console.log("Post successfully deleted");
      if (router) router.back();
    } catch (error: any) {
      console.log("Error deleting post", error.message);
      setLoadingDelete(false);
    }
  };
  return (
    <Flex
      border="1px solid"
      bg={bg}
      borderColor={singlePostView ? borderColor : borderColor}
      borderRadius={singlePostView ? 4 : 4}
      cursor={singlePostView ? "unset" : "pointer"}
      _hover={{ borderColor: singlePostView ? "none" : hoverBorderColor }}
      onClick={() => onSelectPost && post && onSelectPost(post, postIdx!)}
    >
      <Flex
        direction="column"
        align="center"
        bg={hoverBg}
        p={2}
        width="40px"
        borderRadius={4}
        cursor="pointer"
      >
        <Icon
          as={
            userVoteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline
          }
          color={userVoteValue === 1 ? iconActiveColor : iconColor}
          fontSize={22}
          onClick={(event) => onVote(event, post, 1, post.communityId ?? "")}
        />
        <Text fontSize="9pt">{post.voteStatus}</Text>
        <Icon
          as={
            userVoteValue === -1
              ? IoArrowDownCircleSharp
              : IoArrowDownCircleOutline
          }
          color={userVoteValue === -1 ? "red.500" : iconColor}
          fontSize={22}
          onClick={(event) => onVote(event, post, -1, post.communityId ?? "")}
        />
      </Flex>

      <Flex direction="column" width="100%">
        <Stack spacing={1} p="10px 10px">
          <Stack direction="row" spacing={0.6} align="center" fontSize="9pt">
            <Icon
              as={FaUserCircle}
              fontSize={18}
              mr={1}
              color={iconActiveColor}
            />
            <Text color={textColor}>
              Posted by {post.userDisplayText}{" "}
              {moment(new Date(post.createdAt.seconds * 1000)).fromNow()}
            </Text>
          </Stack>
          <Text fontSize="12pt" fontWeight={600}>
            {post.title}
          </Text>
          <Text fontSize="10pt">{post.body}</Text>
          {post.imageURL && (
            <Flex justify="center" align="center" p={2}>
              {loadingImage && (
                <Skeleton height="200px" width="100%" borderRadius={4} />
              )}
              <Image
                maxHeight="460px"
                src={post.imageURL}
                display={loadingImage ? "none" : "unset"}
                onLoad={() => setLoadingImage(false)}
                alt="Post Image"
              />
            </Flex>
          )}
        </Stack>

        <Flex ml={1} mb={0.5} color={textColor} fontWeight={600}>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: hoverBg }}
            cursor="pointer"
          >
            <Icon as={BsChat} mr={2} />
            <Text fontSize="9pt">{post.numberOfComments}</Text>
          </Flex>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: hoverBg }}
            cursor="pointer"
          >
            <Icon as={IoArrowRedoOutline} mr={2} />
            <Text fontSize="9pt">Share</Text>
          </Flex>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: hoverBg }}
            cursor="pointer"
          >
            <Icon as={IoBookmarkOutline} mr={2} />
            <Text fontSize="9pt">Save</Text>
          </Flex>
          {userIsCreator && (
            <Flex
              align="center"
              p="8px 10px"
              borderRadius={4}
              _hover={{ bg: hoverBg }}
              cursor="pointer"
              onClick={handleDelete}
            >
              {loadingDelete ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <Icon as={AiOutlineDelete} mr={2} />
                  <Text fontSize="9pt">Delete</Text>
                </>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default PostItem;
