"use client";

import { auth } from "@/firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import usePosts from "@/hooks/usePosts";
import { useEffect } from "react";
import { firestore } from "@/firebase/clientApp";
import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import PostItem from "../Post/PostItem";
import { Post, PostVote } from "@/atoms/postsAtom";
import { Stack } from "@chakra-ui/react";

type UserPostsProps = {
  userId?: string;
};

const UserPost: React.FC<UserPostsProps> = ({ userId }) => {
  const [user] = useAuthState(auth);
  const {
    postStateValue,
    setPostStateValue,
    onVote,
    onDeletePost,
    onSelectPost,
  } = usePosts();

  const fetchPosts = async (userId?: string) => {
    try {
      console.log("user id :", user?.uid);

      const postsQuery = query(
        collection(firestore, "posts"),
        where("creatorId", "==", userId)
      );

      const postDocs = await getDocs(postsQuery);

      console.log(" Total Posts Fetched:", postDocs.docs.length);

      postDocs.docs.forEach((doc) => console.log(" Post Data:", doc.data()));

      const posts: Post[] = postDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];

      console.log("Posts Array:", posts);

      setPostStateValue((prev) => ({
        ...prev,
        posts, // Now correctly typed as `Post[]`
      }));
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  };

  const fetchUserVotes = async () => {
    if (!user?.uid) return;

    try {
      const votesQuery = query(
        collection(firestore, `users/${user.uid}/postVotes`)
      );
      const voteDocs = await getDocs(votesQuery);

      const votes = voteDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PostVote[]; //  Ensure correct shape

      console.log("Fetched votes:", votes); // Debugging log

      setPostStateValue((prev) => ({
        ...prev,
        postVotes: [...prev.postVotes, ...votes], //  Append instead of replacing
      }));
    } catch (error) {
      console.error("Error fetching votes:", error);
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchPosts(userId);
  }, [userId]);

  console.log("postStateValue", postStateValue);

  useEffect(() => {
    if (user) {
      fetchUserVotes();
    }
  }, [user]);

  return (
    <div>
      <Stack>
        {postStateValue.posts.map((post) => (
          <PostItem
            key={post.id}
            post={post}
            userVoteValue={
              postStateValue.postVotes.find((item) => item.postId === post.id)
                ?.voteValue ?? 0
            }
            userIsCreator={user?.uid === post.creatorId}
            onVote={onVote}
            onSelectPost={onSelectPost}
            onDeletePost={onDeletePost}
          />
        ))}
      </Stack>
    </div>
  );
};

export default UserPost;
