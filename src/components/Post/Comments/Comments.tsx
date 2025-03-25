import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Flex,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
  useColorModeValue,
  useTheme,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../../atoms/authModalAtom";
import { Post, postState } from "../../../atoms/postsAtom";
import { firestore } from "../../../firebase/clientApp";
import CommentItem, { Comment } from "./CommentItem";
import CommentInput from "./CommentInput";

type CommentsProps = {
  user?: User | null;
  selectedPost: Post;
  community: string;
};

const Comments: React.FC<CommentsProps> = ({
  user,
  selectedPost,
  community,
}) => {
  const theme = useTheme();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentFetchLoading, setCommentFetchLoading] = useState(false);
  const [commentCreateLoading, setCommentCreateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState("");
  const setAuthModalState = useSetRecoilState(authModalState);
  const setPostState = useSetRecoilState(postState);

  //  Use centralized theme values
  const bg = useColorModeValue(
    theme.colors.commentsComponent.bg.light,
    theme.colors.commentsComponent.bg.dark
  );
  const borderColor = useColorModeValue(
    theme.colors.postItem.borderColorLight,
    theme.colors.postItem.borderColorDark
  );
  const textColor = useColorModeValue(
    theme.colors.commentsComponent.textColor.light,
    theme.colors.commentsComponent.textColor.dark
  );
  const skeletonBg = useColorModeValue(
    theme.colors.commentsComponent.skeletonBg.light,
    theme.colors.commentsComponent.skeletonBg.dark
  );

  const onCreateComment = async (comment: string) => {
    console.log("🚀 community prop in Comments.tsx:", community); // Debugging

    if (!user) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    setCommentCreateLoading(true);
    try {
      const batch = writeBatch(firestore);

      // Create comment document
      const commentDocRef = doc(collection(firestore, "comments"));
      batch.set(commentDocRef, {
        postId: selectedPost.id,
        creatorId: user.uid,
        creatorDisplayText: user.email!.split("@")[0],
        creatorPhotoURL: user.photoURL,
        communityId: community,
        text: comment,
        postTitle: selectedPost.title,
        createdAt: serverTimestamp(),
      } as Comment);

      // Update post numberOfComments
      batch.update(doc(firestore, "posts", selectedPost.id), {
        numberOfComments: increment(1),
      });
      await batch.commit();

      setComment("");
      const { id: postId, title } = selectedPost;
      setComments((prev) => [
        {
          id: commentDocRef.id,
          creatorId: user.uid,
          creatorDisplayText: user.email!.split("@")[0],
          creatorPhotoURL: user.photoURL,
          communityId: community,
          postId,
          postTitle: title,
          text: comment,
          createdAt: {
            seconds: Date.now() / 1000,
          },
        } as Comment,
        ...prev,
      ]);

      // Fetch posts again to update number of comments
      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! + 1,
        } as Post,
        postUpdateRequired: true,
      }));
    } catch (error: any) {
      console.log("onCreateComment error", error.message);
    }
    setCommentCreateLoading(false);
  };

  const onDeleteComment = useCallback(
    async (comment: Comment) => {
      setDeleteLoading(comment.id as string);
      try {
        if (!comment.id) throw "Comment has no ID";
        const batch = writeBatch(firestore);
        const commentDocRef = doc(firestore, "comments", comment.id);
        batch.delete(commentDocRef);

        batch.update(doc(firestore, "posts", comment.postId), {
          numberOfComments: increment(-1),
        });

        await batch.commit();

        setPostState((prev) => ({
          ...prev,
          selectedPost: {
            ...prev.selectedPost,
            numberOfComments: prev.selectedPost?.numberOfComments! - 1,
          } as Post,
          postUpdateRequired: true,
        }));

        setComments((prev) => prev.filter((item) => item.id !== comment.id));
      } catch (error: any) {
        console.log("Error deleting comment", error.message);
      }
      setDeleteLoading("");
    },
    [setComments, setPostState]
  );

  const getPostComments = async () => {
    try {
      const commentsQuery = query(
        collection(firestore, "comments"),
        where("postId", "==", selectedPost.id),
        orderBy("createdAt", "desc")
      );
      const commentDocs = await getDocs(commentsQuery);
      const comments = commentDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(comments as Comment[]);
    } catch (error: any) {
      console.log("getPostComments error", error.message);
    }
    setCommentFetchLoading(false);
  };

  useEffect(() => {
    console.log("HERE IS SELECTED POST", selectedPost.id);
    getPostComments();
  }, []);

  return (
    <Box
      bg={bg}
      p={2}
      borderRadius="0px 0px 4px 4px"
      borderColor={borderColor}
    >
      <Flex
        direction="column"
        pl={10}
        pr={4}
        mb={6}
        fontSize="10pt"
        width="100%"
      >
        <CommentInput
          comment={comment}
          setComment={setComment}
          loading={commentCreateLoading}
          user={user}
          onCreateComment={onCreateComment}
        />
      </Flex>
      <Stack spacing={6} p={2}>
        {commentFetchLoading ? (
          [0, 1, 2].map((item) => (
            <Box key={item} padding="6" bg={skeletonBg}>
              <SkeletonCircle size="10" />
              <SkeletonText mt="4" noOfLines={2} spacing="4" />
            </Box>
          ))
        ) : comments.length > 0 ? (
          comments.map((item) => (
            <CommentItem
              key={item.id}
              comment={item}
              userId={user?.uid}
              onDeleteComment={onDeleteComment}
              isLoading={deleteLoading === (item.id as string)}
            />
          ))
        ) : (
          <Flex
            direction="column"
            justify="center"
            align="center"
            borderTop="1px solid"
            borderColor={borderColor}
            p={20}
          >
            <Text fontWeight={700} opacity={0.3} color={textColor}>
              No Comments Yet
            </Text>
          </Flex>
        )}
      </Stack>
    </Box>
  );
};

export default Comments;
