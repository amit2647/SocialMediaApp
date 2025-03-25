import { Community } from "@/atoms/communitiesAtom";
import { Post, postState, PostVote } from "@/atoms/postsAtom";
import { auth, firestore } from "@/firebase/clientApp";
import usePosts from "@/hooks/usePosts";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import PostItem from "./PostItem";
import { useAuthState } from "react-firebase-hooks/auth";
import { Stack } from "@chakra-ui/react";
import PostLoader from "./PostLoader";
import { useRecoilState } from "recoil";
import { useRouter } from "next/navigation";


type PostsProps = {
  communityData: Community;
};

const Posts: React.FC<PostsProps> = ({ communityData }) => {
  //useAuthstate
  const [postItems, setPostItems] = useRecoilState(postState);
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  const {
    postStateValue,
    setPostStateValue,
    onVote,
    onDeletePost,
  } = usePosts();

  const getPosts = async () => {
    console.log("WE ARE GETTING POSTS!!!");

    setLoading(true);
    try {
      const postsQuery = query(
        collection(firestore, "posts"),
        where("communityId", "==", communityData.id),
        orderBy("createdAt", "desc")
      );
      const postDocs = await getDocs(postsQuery);
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPostItems((prev) => ({
        ...prev,
        posts: posts as Post[],
        postsCache: {
          ...prev.postsCache,
          [communityData.id]: posts as Post[],
        },
        postUpdateRequired: false,
      }));
    } catch (error: any) {
      console.log("getPosts error", error.message);
    }
    setLoading(false);
  };

  const getUserPostVotes = async () => {
    if (!user?.uid) return;

    const postIds = postStateValue.posts.map((post) => post.id);
    if (postIds.length === 0) return;

    console.log("Fetching user post votes for Posts.tsx...");
    const postVotesQuery = query(
      collection(firestore, `users/${user.uid}/postVotes`),
      where("postId", "in", postIds)
    );

    const unsubscribe = onSnapshot(postVotesQuery, (querySnapshot) => {
      const postVotes = querySnapshot.docs.map((postVote) => ({
        id: postVote.id,
        ...postVote.data(),
      }));

      console.log("User Post Votes (Posts.tsx):", postVotes);
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: postVotes as PostVote[],
      }));
    });

    return () => unsubscribe();
  };

  const onSelectPost = (post: Post, postIdx: number) => {
    setPostStateValue((prev) => ({
      ...prev,
      selectedPost: { ...post, postIdx },
    }));
    router.push(`/${communityData?.id!}/comments/${post.id}`);
  };

  useEffect(() => {
    if (!user?.uid || postStateValue.posts.length === 0) return;
    getUserPostVotes();

    return () => {
      setPostStateValue((prev) => ({ ...prev, postVotes: [] }));
    };
  }, [postStateValue.posts, user?.uid]);

  useEffect(() => {
    getPosts();
  }, []);

  console.log("user Vote value in posts ", postStateValue);

  return (
    <>
      {loading ? (
        <PostLoader />
      ) : (
        <Stack>
          {postItems.posts.map((post: Post, index) => (
            <PostItem
              key={post.id}
              post={post}
              userIsCreator={user?.uid === post.creatorId}
              userVoteValue={
                postItems.postVotes.find((item) => item.postId === post.id)
                  ?.voteValue ?? 0
              }
              onVote={onVote}
              onSelectPost={onSelectPost}
              onDeletePost={onDeletePost}
            />
          ))}
        </Stack>
      )}
    </>
  );
};
export default Posts;

