"use client";
import React, { useState } from "react";
import { BiPoll } from "react-icons/bi";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { Flex, Icon, useColorModeValue, useTheme } from "@chakra-ui/react";
import TabItem from "./TabItem";
import TextInputs from "./PostForm/TextInputs";
import ImageUpload from "./PostForm/ImageUpload";
import { User } from "firebase/auth";
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";
import { useRouter } from "next/navigation";
import { Post, postState } from "@/atoms/postsAtom";
import { useRecoilState } from "recoil";

type NewPostFormProps = {
  user: User;
  communityId?: string;
};

const formTabs: TabItems[] = [
  {
    title: "Post",
    icon: IoDocumentText,
  },
  {
    title: "Image & Video",
    icon: IoImageOutline,
  },
  {
    title: "Link",
    icon: BsLink45Deg,
  },
  {
    title: "Poll",
    icon: BiPoll,
  },
  {
    title: "Talk",
    icon: BsMic,
  },
];

export type TabItems = {
  title: string;
  icon: typeof Icon.arguments;
};

const NewPostForm: React.FC<NewPostFormProps> = ({ user, communityId }) => {
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [textInput, setTextInput] = useState({
    title: "",
    body: "",
  });
  const [selectedFile, setSelectedFile] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [postStateValue, setPostStateValue] = useRecoilState(postState);
  const [selectedCommunity, setSelectedCommunity] = useState(communityId || "");
  const router = useRouter();

  const theme = useTheme();

  // Dark mode support
  const bgColor = useColorModeValue(
    theme.colors.newPostForm.bg.light,
    theme.colors.newPostForm.bg.dark
  );
  const textColor = useColorModeValue(
    theme.colors.newPostForm.text.light,
    theme.colors.newPostForm.text.dark
  );
  const borderColor = useColorModeValue(
    theme.colors.newPostForm.border.light,
    theme.colors.newPostForm.border.dark
  );
  const handleCreatePost = async () => {
    setLoading(true);
    const { title, body } = textInput;

    try {
      const newPost: Omit<Post, "id"> = {
        creatorId: user.uid,
        userDisplayText: user.displayName ?? user.email ?? "Anonymous",
        title,
        body,
        communityId: selectedCommunity || undefined,
        voteStatus: 0,
        numberOfComments: 0,
        createdAt: Timestamp.now(),
      };

      // ✅ Add to Firestore WITHOUT "id" field
      const postDocRef = await addDoc(collection(firestore, "posts"), newPost);

      // ✅ Retrieve the generated Firestore ID
      const postId = postDocRef.id;

      const updatedPost: Post = {
        ...newPost,
        id: postId, // ✅ Now include the Firestore-generated ID
      };

      setPostStateValue((prev) => ({
        ...prev,
        posts: [updatedPost, ...prev.posts], // ✅ Add the post with a proper ID
      }));

      console.log("HERE IS NEW POST ID", postDocRef.id);

      let imageURL: string | null = null;
      if (selectedFile) {
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            selectedFile,
            postId: postDocRef.id,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          imageURL = data.imageURL;
          if (imageURL && !imageURL.startsWith("http")) {
            imageURL = `http://${imageURL}`;
          }
          await updateDoc(postDocRef, { imageURL });
          console.log("HERE IS IMAGE URL", imageURL);
        } else {
          throw new Error(data.error || "Failed to upload image");
        }
      }

      router.back();
    } catch (error: any) {
      console.error("Error creating post:", error.message);
      setError("Error creating post");
    }
    setLoading(false);
  };

  const onSelectedImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();

    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedFile(readerEvent.target.result as string);
      }
    };
  };

  const onTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { name, value },
    } = event;
    setTextInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Flex
      direction="column"
      bg={bgColor}
      color={textColor}
      borderRadius={4}
      border="1px solid"
      borderColor={borderColor}
      mt={2}
    >
      <Flex width="100%">
        {formTabs.map((item) => (
          <TabItem
            key={item.title}
            item={item}
            selected={item.title === selectedTab}
            setSelectedTabs={setSelectedTab}
          />
        ))}
      </Flex>
      <Flex p={4}>
        {selectedTab === "Post" && (
          <TextInputs
            textInputs={textInput}
            handleTextChange={handleCreatePost}
            onChange={onTextChange}
            loading={loading}
          />
        )}
        {selectedTab === "Image & Video" && (
          <ImageUpload
            selectedFile={selectedFile}
            onSelectedImage={onSelectedImage}
            setSelectedTab={setSelectedTab}
            setSelectedFile={setSelectedFile}
          />
        )}
      </Flex>
    </Flex>
  );
};

export default NewPostForm;
