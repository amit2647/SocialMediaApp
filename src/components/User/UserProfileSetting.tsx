"use client";

import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  Image,
  useColorModeValue,
  useTheme,
} from "@chakra-ui/react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../firebase/clientApp";
import { useRecoilState } from "recoil";
import { doc, updateDoc } from "firebase/firestore";
import { User } from "firebase/auth";

type UserProfileSettingProps = {
  user?: User | null;
};

const UserProfileSetting: React.FC<UserProfileSettingProps> = ({ user }) => {
  const theme = useTheme();
  const router = useRouter();
  const selectFileRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<string>();
  const [imageLoading, setImageLoading] = useState(false);

  const bg = useColorModeValue(
    theme.colors.aboutComponent.bg.light,
    theme.colors.aboutComponent.bg.dark
  );
  const borderColor = useColorModeValue(
    theme.colors.aboutComponent.borderColor.light,
    theme.colors.aboutComponent.borderColor.dark
  );
  const textColor = useColorModeValue(
    theme.colors.aboutComponent.textColor.light,
    theme.colors.aboutComponent.textColor.dark
  );
  const iconColor = useColorModeValue(
    theme.colors.aboutComponent.iconColor.light,
    theme.colors.aboutComponent.iconColor.dark
  );
  const buttonBg = useColorModeValue(
    theme.colors.aboutComponent.buttonBg.light,
    theme.colors.aboutComponent.buttonBg.dark
  );
  const buttonHoverBg = useColorModeValue(
    theme.colors.aboutComponent.buttonHoverBg.light,
    theme.colors.aboutComponent.buttonHoverBg.dark
  );
  const headerBg = useColorModeValue(
    theme.colors.aboutComponent.headerBg.light,
    theme.colors.aboutComponent.headerBg.dark
  );

  const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const updateProfileImage = async () => {
    if (!selectedFile) return;
    setImageLoading(true);

    try {
      const response = await fetch("/api/uploadImage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedFile, userId: user?.uid }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to upload image");

      let downloadURL = data.imageURL;
      if (
        !downloadURL.startsWith("http://") &&
        !downloadURL.startsWith("https://")
      ) {
        downloadURL = `http://${downloadURL}`;
      }

      await updateDoc(doc(firestore, "users", user?.uid as string), {
        profileImage: downloadURL,
      });
    } catch (error: any) {
      console.error("updateProfileImage error:", error.message);
    }

    setImageLoading(false);
  };

  return (
    <Box pt={4} position="sticky" top="14px">
      <Flex
        justify="space-between"
        align="center"
        p={3}
        color="white"
        bg={headerBg}
        borderRadius="4px 4px 0px 0px"
      >
        <Text fontSize="10pt" fontWeight={700}>
          User Profile
        </Text>
        <Icon as={HiOutlineDotsHorizontal} cursor="pointer" color={iconColor} />
      </Flex>
      <Flex
        direction="column"
        p={3}
        bg={bg}
        borderRadius="0px 0px 4px 4px"
        border="1px solid"
        borderColor={borderColor}
      >
        {user ? (
          <>
            <Stack spacing={2} color={textColor}>
              <Flex align="center" justify="center">
                {user.photoURL ? (
                  <Image
                    borderRadius="full"
                    boxSize="66px"
                    src={user.photoURL}
                    alt="Community Image"
                    position="relative"
                    border={`4px solid ${borderColor}`}
                  />
                ) : (
                  <Icon
                    as={FaUserCircle}
                    fontSize={64}
                    position="relative"
                    color={iconColor}
                    border={`4px solid ${borderColor}`}
                    borderRadius="50%"
                  />
                )}
              </Flex>
              <Flex direction="column" align="center">
                <Text fontSize="12pt" fontWeight={700}>
                  {user.displayName || "Anonymous"}
                </Text>
                <Text fontSize="10pt" color="gray.500">
                  {user.email}
                </Text>
              </Flex>
              <Divider borderColor={borderColor} />
              <Flex align="center" justify="center">
                <Button
                  bg={buttonBg}
                  _hover={{ bg: buttonHoverBg }}
                  onClick={() => router.push("/settings")}
                >
                  Edit Profile
                </Button>
              </Flex>
              <Divider borderColor={borderColor} />
              <Flex align="center" justify="space-between">
                <Text
                  cursor="pointer"
                  _hover={{ textDecoration: "underline" }}
                  onClick={() => selectFileRef.current?.click()}
                >
                  Change Profile Picture
                </Text>
              </Flex>
              <input
                id="file-upload"
                type="file"
                accept="image/x-png,image/gif,image/jpeg"
                hidden
                ref={selectFileRef}
                onChange={onSelectImage}
              />
            </Stack>
          </>
        ) : (
          <Stack mt={2}>
            <SkeletonCircle size="10" />
            <Skeleton height="10px" />
            <Skeleton height="20px" />
          </Stack>
        )}
      </Flex>
    </Box>
  );
};

export default UserProfileSetting;
