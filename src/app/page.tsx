"use client";

import { useEffect, useState } from "react";
import { Stack } from "@chakra-ui/react";
import {
  collection,
  DocumentData,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  where,
} from "firebase/firestore";
import type { NextPage } from "next";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";
import { communityState } from "../atoms/communitiesAtom";
import { Post, PostVote } from "../atoms/postsAtom";
import CreatePostLink from "../components/Community/CreatePostLink";
import Recommendations from "../components/Community/Recommendations";
import PageContentLayout from "../components/Layout/PageContent";
import PostLoader from "../components/Post/PostLoader";
import PostItem from "../components/Post/PostItem";
import { auth, firestore } from "../firebase/clientApp";
import usePosts from "../hooks/usePosts";
import Premium from "../components/Community/Premium";
import PersonalHome from "../components/Community/PersonalHome";
import NoPosts from "@/components/Post/NoPost";

const Home: NextPage = () => {
  const [user, loadingUser] = useAuthState(auth);

  const {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
    loading,
    setLoading,
  } = usePosts();
  const communityStateValue = useRecoilValue(communityState);

  const getUserHomePosts = async () => {
    console.log("Fetching User Feed...");
    setLoading(true);

    try {
      //  Fetch ALL posts (community & personal) sorted by createdAt
      const allPostsQuery = query(
        collection(firestore, "posts"),
        orderBy("createdAt", "desc"), //  Order posts by latest
        limit(10)
      );

      const allPostsDocs = await getDocs(allPostsQuery);
      const allPosts = allPostsDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];

      console.log("Feed Posts Retrieved:", allPosts);
      setPostStateValue((prev) => ({ ...prev, posts: allPosts }));
    } catch (error: any) {
      console.error("Error fetching user posts:", error.message);
    }
    setLoading(false);
  };

  const getNoUserHomePosts = async () => {
    console.log("Fetching No User Feed...");
    setLoading(true);
    try {
      const postQuery = query(
        collection(firestore, "posts"),
        orderBy("createdAt", "desc"), // Order by latest posts
        limit(10)
      );
      const postDocs = await getDocs(postQuery);
      const posts = postDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];

      console.log("No User Feed Posts:", posts);
      setPostStateValue((prev) => ({ ...prev, posts }));
    } catch (error: any) {
      console.error("Error fetching no user posts:", error.message);
    }
    setLoading(false);
  };

  const getUserPostVotes = async () => {
    if (!user?.uid) return;

    const postIds = postStateValue.posts.map((post) => post.id);
    if (postIds.length === 0) return;

    console.log("Fetching user post votes...");
    const postVotesQuery = query(
      collection(firestore, `users/${user.uid}/postVotes`),
      where("postId", "in", postIds)
    );

    const unsubscribe = onSnapshot(postVotesQuery, (querySnapshot) => {
      const postVotes = querySnapshot.docs.map((postVote) => ({
        id: postVote.id,
        ...postVote.data(),
      }));

      console.log("User Post Votes:", postVotes);
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: postVotes as PostVote[],
      }));
    });

    return () => unsubscribe();
  };

  useEffect(() => {
    console.log("User:", user);
    console.log("Snippets Fetched:", communityStateValue.initSnippetsFetched);

    if (!communityStateValue.initSnippetsFetched) {
      console.log("Waiting for snippets to load...");
      return;
    }

    if (user) {
      getUserHomePosts();
    }
  }, [user, communityStateValue.initSnippetsFetched]);

  useEffect(() => {
    if (!user && !loadingUser) {
      getNoUserHomePosts();
    }
  }, [user, loadingUser]);

  useEffect(() => {
    if (!user?.uid || postStateValue.posts.length === 0) return;
    getUserPostVotes();

    return () => {
      setPostStateValue((prev) => ({ ...prev, postVotes: [] }));
    };
  }, [postStateValue.posts, user?.uid]);

  return (
    <PageContentLayout>
      <>
        <CreatePostLink />
        {loading ? (
          <>
            <PostLoader />
          </>
        ) : postStateValue.posts.length > 0 ? (
          <Stack>
            {postStateValue.posts.map((post: Post, index) => (
              <PostItem
                key={post.id}
                post={post}
                postIdx={index}
                onVote={onVote}
                onDeletePost={onDeletePost}
                userVoteValue={
                  postStateValue.postVotes.find(
                    (item) => item.postId === post.id
                  )?.voteValue
                }
                userIsCreator={user?.uid === post.creatorId}
                onSelectPost={onSelectPost}
                homePage
              />
            ))}
          </Stack>
        ) : (
          <NoPosts />
        )}
      </>
      <Stack spacing={5} position="sticky" top="14px">
        <Recommendations />
        <PersonalHome />
      </Stack>
    </PageContentLayout>
  );
};

export default Home;
