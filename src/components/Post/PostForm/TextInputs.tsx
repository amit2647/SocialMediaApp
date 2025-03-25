import {
  Button,
  Flex,
  Input,
  Stack,
  Textarea,
  useColorModeValue,
  useTheme,
} from "@chakra-ui/react";
import React from "react";

type TextInputsProps = {
  textInputs: {
    title: string;
    body: string;
  };
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleTextChange: () => void;
  loading: boolean;
};

const TextInputs: React.FC<TextInputsProps> = ({
  textInputs,
  onChange,
  handleTextChange,
  loading,
}) => {
  // Dark mode colors
  const theme = useTheme();

  const bgColor = useColorModeValue(
    theme.colors.textInputs.bg.light,
    theme.colors.textInputs.bg.dark
  );
  const textColor = useColorModeValue(
    theme.colors.textInputs.text.light,
    theme.colors.textInputs.text.dark
  );
  const placeholderColor = useColorModeValue(
    theme.colors.textInputs.placeholder.light,
    theme.colors.textInputs.placeholder.dark
  );
  const focusBorderColor = useColorModeValue(
    theme.colors.textInputs.focusBorder.light,
    theme.colors.textInputs.focusBorder.dark
  );

  return (
    <Stack spacing={3} width="100%">
      <Input
        name="title"
        value={textInputs.title}
        onChange={onChange}
        fontSize="10pt"
        borderRadius={4}
        placeholder="Title"
        bg={bgColor}
        color={textColor}
        _placeholder={{ color: placeholderColor }}
        _focus={{
          outline: "none",
          border: "1px solid",
          borderColor: focusBorderColor,
        }}
      />
      <Textarea
        name="body"
        value={textInputs.body}
        onChange={onChange}
        fontSize="10pt"
        borderRadius={4}
        placeholder="Text (optional)"
        height="100px"
        bg={bgColor}
        color={textColor}
        _placeholder={{ color: placeholderColor }}
        _focus={{
          outline: "none",
          border: "1px solid",
          borderColor: focusBorderColor,
        }}
      />
      <Flex justify="flex-end">
        <Button
          height="34px"
          padding="0px 30px"
          disabled={!textInputs.title}
          isLoading={loading}
          onClick={handleTextChange}
        >
          Post
        </Button>
      </Flex>
    </Stack>
  );
};
export default TextInputs;
