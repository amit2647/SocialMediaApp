import { Flex, Text, Button, useColorModeValue, Icon } from "@chakra-ui/react";
import { FaRegNewspaper } from "react-icons/fa";
import { useTheme } from "@chakra-ui/react";

const NoPosts = () => {
  const theme = useTheme();

  const iconColor = useColorModeValue(
    theme.colors.noPosts.iconColor,
    theme.colors.noPosts.iconColor
  );
  const textColor = useColorModeValue(
    theme.colors.noPosts.textColor,
    theme.colors.noPosts.textColor
  );
  const subTextColor = useColorModeValue(
    theme.colors.noPosts.subTextColor,
    theme.colors.noPosts.subTextColor
  );
  const buttonColorScheme = theme.colors.noPosts.buttonColorScheme;

  return (
    <Flex direction="column" align="center" justify="center" py={10}>
      <Icon as={FaRegNewspaper} boxSize={12} color={iconColor} mb={4} />
      <Text fontSize="lg" fontWeight="bold" color={textColor}>
        No posts available
      </Text>
      <Text fontSize="sm" color={subTextColor} mb={4}>
        Be the first to share something interesting!
      </Text>
      <Button
        colorScheme={buttonColorScheme}
        size="sm"
        onClick={() => {
          /* Add logic to create post */
        }}
      >
        Create a Post
      </Button>
    </Flex>
  );
};

export default NoPosts;
