"use client";
import PageContent from "@/components/Layout/PageContent";
import NewPersonalPostForm from "@/components/Post/NewPersonalPostForm";
import { auth } from "@/firebase/clientApp";
import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const SubmitPersonalPostPage: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  
  return (
    <PageContent>
      <>
        <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
          <Text>Create a Personal Post</Text>
        </Box>
        {user && <NewPersonalPostForm user={user} />}
      </>
      <></>
    </PageContent>
  );
};

export default SubmitPersonalPostPage;
