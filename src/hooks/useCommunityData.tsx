"use client";

import React, { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  Community,
  CommunitySnippet,
  communityState,
  defaultCommunity,
} from "@/atoms/communitiesAtom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/clientApp";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  writeBatch,
} from "firebase/firestore";
import { authModalState } from "@/atoms/authModalAtom";
import { useParams } from "next/navigation";

const useCommunityData = (ssrCommunityData?: boolean) => {
  const [user] = useAuthState(auth);
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);
  const setAuthModalState = useSetRecoilState(authModalState);
  const { communityId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onJoinOrLeaveCommunity = (
    commmunityData: Community,
    isJoined: boolean
  ) => {
    // is user signed in
    // if not open auth model

    if (!user) {
      //open modal
      setAuthModalState({ open: true, view: "login" });
    }
    setLoading(true);
    if (isJoined) {
      leaveCommunity(commmunityData.id);
      return;
    }
    joinCommunity(commmunityData);
  };

  const getCommunityData = async (communityId: string) => {
    // this causes weird memory leak error - not sure why
    // setLoading(true);
    console.log("GETTING COMMUNITY DATA");

    try {
      const communityDocRef = doc(
        firestore,
        "communities",
        communityId as string
      );
      const communityDoc = await getDoc(communityDocRef);
      // setCommunityStateValue((prev) => ({
      //   ...prev,
      //   visitedCommunities: {
      //     ...prev.visitedCommunities,
      //     [communityId as string]: {
      //       id: communityDoc.id,
      //       ...communityDoc.data(),
      //     } as Community,
      //   },
      // }));
      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          id: communityDoc.id,
          ...communityDoc.data(),
        } as Community,
      }));
    } catch (error: any) {
      console.log("getCommunityData error", error.message);
    }
    setLoading(false);
  };

  const getMySnipppets = async () => {
    setLoading(true);
    try {
      //get user snippets

      const snippetsDoc = await getDocs(
        collection(firestore, `users/${user?.uid}/communitySnippets`)
      );

      const snippets = snippetsDoc.docs.map((doc) => ({ ...doc.data() }));
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as CommunitySnippet[],
        initSnippetsFetched: true,
      }));

      // console.log("here are snippets", snippets);
    } catch (error: any) {
      console.log("getMySnippet error", error);
      setError(error);
    }
    setLoading(false);
  };

  const joinCommunity = async (communityData: Community) => {
    //batch write
    try {
      const batch = writeBatch(firestore);

      const newSnippet: CommunitySnippet = {
        communityId: communityData.id,
        imageURL: communityData.imageURL || "",
      };

      batch.set(
        doc(
          firestore,
          `users/${user?.uid}/communitySnippets`,
          communityData.id
        ),
        newSnippet
      );

      batch.update(doc(firestore, "communities", communityData.id), {
        numberOfMembers: increment(1),
      });

      await batch.commit();

      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [...prev.mySnippets, newSnippet],
      }));
    } catch (error: any) {
      setError(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    // if (ssrCommunityData) return;
    if (communityId) {
      const communityData = communityStateValue.currentCommunity;

      if (!communityData.id) {
        getCommunityData(communityId as string);
        return;
      }
      // console.log("this is happening", communityStateValue);
    } else {
      /**
       * JUST ADDED THIS APRIL 24
       * FOR NEW LOGIC OF NOT USING visitedCommunities
       */
      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: defaultCommunity,
      }));
    }
  }, [useParams(), communityStateValue.currentCommunity]);

  const leaveCommunity = async (communityId: string) => {
    try {
      // batch write
      const batch = writeBatch(firestore);

      // deleting  the community snippet for user
      batch.delete(
        doc(firestore, `users/${user?.uid}/communitySnippets`, communityId)
      );

      // updating the numberOfMember(-1)
      batch.update(doc(firestore, "communities", communityId), {
        numberOfMembers: increment(-1),
      });

      await batch.commit();

      // updaating recoil state - community.mySnippets

      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: prev.mySnippets.filter(
          (item) => item.communityId !== communityId
        ),
      }));
    } catch (error: any) {
      console.log("leaveCommunity error", error.message);
      setError(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    getMySnipppets();
  }, [user]);

  return {
    communityStateValue,
    onJoinOrLeaveCommunity,
    loading,
  };
};
export default useCommunityData;
