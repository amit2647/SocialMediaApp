"use client";

import { useEffect, useState } from "react";
import { auth, firestore } from "@/firebase/clientApp";
import { doc, getDoc } from "firebase/firestore";
import { Community, communityState } from "@/atoms/communitiesAtom";
import CommunityNotFound from "@/components/Community/CommunityNotFound";
import Header from "@/components/Community/Header";
import PageContent from "@/components/Layout/PageContent";
import CreatePostLink from "@/components/Community/CreatePostLink";
import Posts from "@/components/Post/Posts";
import { useRecoilState } from "recoil";
import About from "@/components/Community/About";
import { useAuthState } from "react-firebase-hooks/auth";

type CommunityPageProps = {
  params: { communityId: string };
};

const fetchCommunityData = async (
  communityId: string
): Promise<Community | null> => {
  try {
    const communityDocRef = doc(firestore, "communities", communityId);
    const communityDoc = await getDoc(communityDocRef);

    if (communityDoc.exists()) {
      return { id: communityDoc.id, ...communityDoc.data() } as Community;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching community data:", error);
    return null;
  }
};

const CommunityPage = ({ params }: CommunityPageProps) => {
  const [user, loadingUser] = useAuthState(auth);
  const [communityData, setCommunityData] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false); // Fix for hydration issue
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);

  useEffect(() => {
    setIsClient(true);

    const loadData = async () => {
      setLoading(true);
      const fetchedData = await fetchCommunityData(params.communityId);

      if (fetchedData) {
        setCommunityData(fetchedData);
        setCommunityStateValue((prev) => ({
          ...prev,
          currentCommunity: fetchedData,
        }));
      }
      setLoading(false);
    };

    loadData();
  }, [params.communityId, setCommunityStateValue]);

  if (!isClient) return <p>Loading...</p>; // Fix for hydration issues
  if (loading) return <p>Loading...</p>;
  if (!communityData) return <CommunityNotFound />;

  return (
    <>
      <Header communityData={communityData} />
      <PageContent>
        <>
          <CreatePostLink />
          <Posts communityData={communityData} />
        </>
        <>
          <About communityData={communityData} />
        </>
      </PageContent>
    </>
  );
};

export default CommunityPage;
