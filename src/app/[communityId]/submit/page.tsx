"use client";

import { communityState } from "@/atoms/communitiesAtom";
import About from "@/components/Community/About";
import PageContent from "@/components/Layout/PageContent";
import NewPostForm from "@/components/Post/NewPostForm";
import { auth } from "@/firebase/clientApp";
import useCommunityData from "@/hooks/useCommunityData";
import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";

type SubmitPostPageProps = {
  params?: { communityId?: string }; // Community ID is optional
};

const SubmitPostPage: React.FC<SubmitPostPageProps> = ({ params }) => {
  const [user] = useAuthState(auth);
  const { communityStateValue } = useCommunityData();

  //  Check if post is outside a community
  const isPersonalPost = !params?.communityId;

  return (
    <PageContent>
      <>
        <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
          <Text>Create a {isPersonalPost ? "Personal" : "Community"} Post</Text>
        </Box>
        {user && (
          <NewPostForm
            user={user}
            communityId={params?.communityId || undefined} // Pass undefined instead of null
          />
        )}
      </>
      {!isPersonalPost && communityStateValue.currentCommunity && (
        <About communityData={communityStateValue.currentCommunity} />
      )}
    </PageContent>
  );
};

export default SubmitPostPage;
