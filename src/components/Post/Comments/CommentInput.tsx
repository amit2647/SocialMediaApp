import React from "react";
import {
  Flex,
  Textarea,
  Button,
  Text,
  useColorModeValue,
  useTheme,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import AuthButtons from "../../Navbar/RightContent/AuthButtons";

type CommentInputProps = {
  comment: string;
  setComment: (value: string) => void;
  loading: boolean;
  user?: User | null;
  onCreateComment: (comment: string) => void;
};

const CommentInput: React.FC<CommentInputProps> = ({
  comment,
  setComment,
  loading,
  user,
  onCreateComment,
}) => {
  const theme = useTheme();
  // Dark mode support
  const bgColor = useColorModeValue(
    theme.colors.commentInput.bg.light,
    theme.colors.commentInput.bg.dark
  );
  const textColor = useColorModeValue(
    theme.colors.commentInput.text.light,
    theme.colors.commentInput.text.dark
  );
  const placeholderColor = useColorModeValue(
    theme.colors.commentInput.placeholder.light,
    theme.colors.commentInput.placeholder.dark
  );
  const focusBorderColor = useColorModeValue(
    theme.colors.commentInput.focusBorder.light,
    theme.colors.commentInput.focusBorder.dark
  );
  const boxBg = useColorModeValue(
    theme.colors.commentInput.boxBg.light,
    theme.colors.commentInput.boxBg.dark
  );
  const borderColor = useColorModeValue(
    theme.colors.commentInput.border.light,
    theme.colors.commentInput.border.dark
  );
  const userText = useColorModeValue(
    theme.colors.commentInput.userText.light,
    theme.colors.commentInput.userText.dark
  );

  return (
    <Flex direction="column" position="relative">
      {user ? (
        <>
          <Text mb={1} color={textColor}>
            Comment as{" "}
            <span style={{ color: userText }}>
              {user?.email?.split("@")[0]}
            </span>
          </Text>
          <Textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="What are your thoughts?"
            fontSize="10pt"
            borderRadius={4}
            minHeight="160px"
            pb={10}
            bg={bgColor}
            color={textColor}
            _placeholder={{ color: placeholderColor }}
            _focus={{
              outline: "none",
              border: `1px solid ${focusBorderColor}`,
            }}
          />
          <Flex
            position="absolute"
            left="1px"
            right={0.1}
            bottom="1px"
            justify="flex-end"
            bg={boxBg}
            p="6px 8px"
            borderRadius="0px 0px 4px 4px"
          >
            <Button
              height="26px"
              disabled={!comment.length}
              isLoading={loading}
              onClick={() => onCreateComment(comment)}
            >
              Comment
            </Button>
          </Flex>
        </>
      ) : (
        <Flex
          align="center"
          justify="space-between"
          borderRadius={2}
          border="1px solid"
          borderColor={useColorModeValue("gray.100", "gray.600")}
          bg={bgColor}
          p={4}
        >
          <Text fontWeight={600} color={textColor}>
            Log in or sign up to leave a comment
          </Text>
          <AuthButtons />
        </Flex>
      )}
    </Flex>
  );
};
export default CommentInput;
