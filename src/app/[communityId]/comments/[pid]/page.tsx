"use client";

import PageContent from "@/components/Layout/PageContent";
import PostItem from "@/components/Post/PostItem";
import { auth, firestore } from "@/firebase/clientApp";
import usePosts from "@/hooks/usePosts";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams } from "next/navigation";
import { Post, PostVote } from "@/atoms/postsAtom";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import About from "@/components/Community/About";
import useCommunityData from "@/hooks/useCommunityData";
import Comments from "@/components/Post/Comments/Comments";

const PostPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const { communityStateValue } = useCommunityData();
  const params = useParams();
  const pid = params?.pid;
  const communityId = params?.communityId;

  const {
    postStateValue,
    setPostStateValue,
    onDeletePost,
    onVote,
    setLoading,
  } = usePosts(communityStateValue.currentCommunity);

  const fetchPost = async () => {
    console.log("FETCHING POST");

    setLoading(true);
    try {
      const postDocRef = doc(firestore, "posts", pid as string);
      const postDoc = await getDoc(postDocRef);
      setPostStateValue((prev) => ({
        ...prev,
        selectedPost: { id: postDoc.id, ...postDoc.data() } as Post,
      }));
      // setPostStateValue((prev) => ({
      //   ...prev,
      //   selectedPost: {} as Post,
      // }));
    } catch (error: any) {
      console.log("fetchPost error", error.message);
    }
    setLoading(false);
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
    if (pid && !postStateValue.selectedPost) {
      fetchPost();
    }
  }, [pid, postStateValue.selectedPost]);

  useEffect(() => {
    if (user) {
      fetchUserVotes();
    }
  }, [user]);

  console.log("Rendering About Component?", {
    communityId: params.communityId,
    currentCommunity: communityStateValue.currentCommunity,
  });

  return (
    <PageContent>
      <>
        {postStateValue.selectedPost && (
          <>
            <PostItem
              post={postStateValue.selectedPost}
              onVote={onVote}
              onDeletePost={onDeletePost}
              userVoteValue={
                postStateValue.postVotes.find(
                  (vote) => vote.postId === postStateValue.selectedPost?.id
                )?.voteValue
              }
              userIsCreator={
                user?.uid === postStateValue.selectedPost?.creatorId
              }
            />
            <Comments
              user={user}
              community={communityId as string}
              selectedPost={postStateValue.selectedPost}
            />
          </>
        )}
      </>
      <>
        {params.communityId !== "undefined" &&
          communityStateValue.currentCommunity?.id !== "undefined" && (
            <About communityData={communityStateValue.currentCommunity} />
          )}
      </>
    </PageContent>
  );
};
export default PostPage;
