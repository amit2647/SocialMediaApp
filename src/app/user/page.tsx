"use client";

import { CommunitySnippet, communityState } from "@/atoms/communitiesAtom";
import { postState, PostVote } from "@/atoms/postsAtom";
import PageContent from "@/components/Layout/PageContent";
import UserPost from "@/components/User/UserPosts";
import UserProfile from "@/components/User/UserProfile";
import UserProfileSetting from "@/components/User/UserProfileSetting";
import UserSettings from "@/components/User/UserSettings";
import { auth, firestore } from "@/firebase/clientApp";
import { collection, getDocs, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";

const page: React.FC = () => {
  const [user] = useAuthState(auth);
  const setCommunityState = useSetRecoilState(communityState);

  const fetchCommunitySnippets = async (userId: string) => {
    try {
      const snippetsCollection = collection(
        firestore,
        `users/${userId}/communitySnippets`
      );
      const snippetDocs = await getDocs(snippetsCollection);

      const snippets = snippetDocs.docs.map((doc) => ({
        communityId: doc.id, // Ensure this matches the expected type
        ...(doc.data() as Omit<CommunitySnippet, "communityId">), // Merge other fields
      }));

      return snippets; // Return the snippets
    } catch (error) {
      console.error(" Error fetching community snippets:", error);
      return [];
    }
  };

  useEffect(() => {
    if (!user) return;

    const fetchAndSetSnippets = async () => {
      const snippets = await fetchCommunitySnippets(user.uid);
      setCommunityState((prev) => ({
        ...prev,
        mySnippets: snippets, //  Update the state correctly
        initSnippetsFetched: true, //  Mark snippets as loaded
      }));
    };

    fetchAndSetSnippets();
  }, [user, setCommunityState]);

  return (
    <>
      <UserProfile user={user} />
      <PageContent>
        <>
          <UserPost userId={user?.uid} />
        </>
        <>
          <UserProfileSetting user={user} />
        </>
      </PageContent>
    </>
  );
};
export default page;
