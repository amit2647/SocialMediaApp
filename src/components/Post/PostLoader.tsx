import React from "react";
import {
  Stack,
  Box,
  SkeletonText,
  Skeleton,
  useColorModeValue,
  useTheme,
} from "@chakra-ui/react";

const PostLoader: React.FC = () => {
  const theme = useTheme();

  // Fetch colors from the theme
  const bg = useColorModeValue(
    theme.colors.postLoader.bgLight,
    theme.colors.postLoader.bgDark
  );
  const boxShadow = useColorModeValue(
    theme.colors.postLoader.boxShadowLight,
    theme.colors.postLoader.boxShadowDark
  );

  return (
    <Stack spacing={6}>
      {[...Array(2)].map((_, index) => (
        <Box
          key={index}
          padding="10px 10px"
          boxShadow={boxShadow}
          bg={bg}
          borderRadius={4}
        >
          <SkeletonText mt="4" noOfLines={1} width="40%" spacing="4" />
          <SkeletonText mt="4" noOfLines={4} spacing="4" />
          <Skeleton mt="4" height="200px" />
        </Box>
      ))}
    </Stack>
  );
};

export default PostLoader;
