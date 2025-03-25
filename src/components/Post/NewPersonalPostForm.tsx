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
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { firestore } from "@/firebase/clientApp";
import { useRouter } from "next/navigation";
import { Post, postState } from "@/atoms/postsAtom";
import { useRecoilState } from "recoil";
import { TabItems } from "./NewPostForm";

type NewPersonalPostFormProps = {
  user: User;
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

const NewPersonalPostForm: React.FC<NewPersonalPostFormProps> = ({ user }) => {
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [textInput, setTextInput] = useState({ title: "", body: "" });
  const [selectedFile, setSelectedFile] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [postStateValue, setPostStateValue] = useRecoilState(postState);
  const router = useRouter();

  const handleCreatePost = async () => {
    setLoading(true);
    try {
      const newPost: Omit<Post, "id"> = {
        creatorId: user.uid,
        userDisplayText: user.displayName ?? user.email ?? "Anonymous",
        title: textInput.title,
        body: textInput.body,
        voteStatus: 0,
        numberOfComments: 0,
        createdAt: Timestamp.now(),
      };

      const postDocRef = await addDoc(collection(firestore, "posts"), newPost);
      const postId = postDocRef.id;

      setPostStateValue((prev) => ({
        ...prev,
        posts: [{ ...newPost, id: postId }, ...prev.posts],
      }));

      router.push("/");
    } catch (error: any) {
      console.error("Error creating post:", error.message);
      setError("Error creating post");
    }
    setLoading(false);
  };

  return (
    <Flex direction="column" borderRadius={4} border="1px solid" mt={2}>
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
            onChange={(e) =>
              setTextInput({ ...textInput, [e.target.name]: e.target.value })
            }
            loading={loading}
          />
        )}
        {selectedTab === "Image & Video" && (
          <ImageUpload
            selectedFile={selectedFile}
            onSelectedImage={(event) => {
              const reader = new FileReader();
              if (event.target.files?.[0]) {
                reader.readAsDataURL(event.target.files[0]);
              }
              reader.onload = (readerEvent) => {
                if (readerEvent.target?.result) {
                  setSelectedFile(readerEvent.target.result as string);
                }
              };
            }}
            setSelectedTab={setSelectedTab}
            setSelectedFile={setSelectedFile}
          />
        )}
      </Flex>
    </Flex>
  );
};

export default NewPersonalPostForm;
