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
import { RiCakeLine } from "react-icons/ri";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../firebase/clientApp";
import { Community, communityState } from "../../atoms/communitiesAtom";
import moment from "moment";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { FaUserCircle } from "react-icons/fa";
import { doc, updateDoc } from "firebase/firestore";

type AboutProps = {
  communityData: Community;
  pt?: number;
  onCreatePage?: boolean;
  loading?: boolean;
};

const About: React.FC<AboutProps> = ({
  communityData,
  pt,
  onCreatePage,
  loading,
}) => {
  const theme = useTheme();
  const [user] = useAuthState(auth);
  const router = useRouter();
  const pathname = usePathname();
  const selectFileRef = useRef<HTMLInputElement>(null);
  const setCommunityStateValue = useSetRecoilState(communityState);

  const [selectedFile, setSelectedFile] = useState<string>();
  const [imageLoading, setImageLoading] = useState(false);

  //  Use centralized theme values
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
  const textbg = useColorModeValue(
    theme.colors.aboutComponent.textbg.light,
    theme.colors.aboutComponent.textbg.dark
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

  const updateImage = async () => {
    if (!selectedFile) return;
    setImageLoading(true);

    try {
      const response = await fetch("/api/uploadImage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedFile, communityId: communityData.id }),
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

      await updateDoc(doc(firestore, "communities", communityData.id), {
        imageURL: downloadURL,
      });

      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: { ...prev.currentCommunity, imageURL: downloadURL },
      }));
    } catch (error: any) {
      console.error("updateImage error:", error.message);
    }

    setImageLoading(false);
  };

  return (
    <Box pt={pt} position="sticky" top="14px">
      <Flex
        justify="space-between"
        align="center"
        p={3}
        color="white"
        bg={headerBg}
        borderRadius="4px 4px 0px 0px"
      >
        <Text fontSize="10pt" fontWeight={700}>
          About Community
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
        {loading ? (
          <Stack mt={2}>
            <SkeletonCircle size="10" />
            <Skeleton height="10px" />
            <Skeleton height="20px" />
          </Stack>
        ) : (
          <>
            <Stack spacing={2} color={textColor}>
              <Flex width="100%" p={2} fontWeight={600} fontSize="10pt">
                <Flex direction="column" flexGrow={1}>
                  <Text>
                    {communityData?.numberOfMembers?.toLocaleString()}
                  </Text>
                  <Text>Members</Text>
                </Flex>
                <Flex direction="column" flexGrow={1}>
                  <Text>1</Text>
                  <Text>Online</Text>
                </Flex>
              </Flex>
              <Divider borderColor={borderColor} />
              <Flex
                align="center"
                width="100%"
                p={1}
                fontWeight={500}
                fontSize="10pt"
              >
                <Icon as={RiCakeLine} mr={2} fontSize={18} color={iconColor} />
                {communityData?.createdAt && (
                  <Text>
                    Created{" "}
                    {moment(
                      new Date(communityData.createdAt!.seconds * 1000)
                    ).format("MMM DD, YYYY")}
                  </Text>
                )}
              </Flex>
              {!onCreatePage && (
                <Link href={`/${communityData.id}/submit`}>
                  <Button
                    mt={3}
                    height="30px"
                    bg={buttonBg}
                    _hover={{ bg: buttonHoverBg }}
                  >
                    Create Post
                  </Button>
                </Link>
              )}
              {user?.uid === communityData?.creatorId && (
                <>
                  <Divider borderColor={borderColor} />
                  <Stack fontSize="10pt" spacing={1}>
                    <Text fontWeight={600}>Admin</Text>
                    <Flex align="center" justify="space-between">
                      <Text
                        color={textbg}
                        cursor="pointer"
                        _hover={{ textDecoration: "underline" }}
                        onClick={() => selectFileRef.current?.click()}
                      >
                        Change Image
                      </Text>
                      {communityData?.imageURL || selectedFile ? (
                        <Image
                          borderRadius="full"
                          boxSize="40px"
                          src={selectedFile || communityData?.imageURL}
                          alt="Community Image"
                        />
                      ) : (
                        <Icon
                          as={FaUserCircle}
                          fontSize={40}
                          color={iconColor}
                          mr={2}
                        />
                      )}
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
              )}
            </Stack>
          </>
        )}
      </Flex>
    </Box>
  );
};

export default About;
