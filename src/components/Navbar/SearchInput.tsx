import { SearchIcon } from "@chakra-ui/icons";
import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import React from "react";

type SearchInputProps = {
  user?: User | null;
};

const SearchInput: React.FC<SearchInputProps> = ({ user }) => {
  // Fetch colors from theme
  const bgColor = useColorModeValue(
    "searchInput.bgLight",
    "searchInput.bgDark"
  );
  const borderColor = useColorModeValue(
    "searchInput.borderLight",
    "searchInput.borderDark"
  );
  const placeholderColor = useColorModeValue(
    "searchInput.placeholderLight",
    "searchInput.placeholderDark"
  );
  const iconColor = useColorModeValue(
    "searchInput.iconLight",
    "searchInput.iconDark"
  );
  const hoverBg = useColorModeValue(
    "searchInput.hoverLight",
    "searchInput.hoverDark"
  );

  return (
    <Flex flexGrow={1} maxWidth={user ? "auto" : "600px"} mr={2} align="center">
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color={iconColor} mb={1} />
        </InputLeftElement>
        <Input
          placeholder="Search"
          fontSize="10pt"
          _placeholder={{ color: placeholderColor }}
          _hover={{
            bg: hoverBg,
            border: "1px solid",
            borderColor: borderColor,
          }}
          _focus={{
            outline: "none",
            border: "1px solid",
            borderColor: borderColor,
          }}
          height="34px"
          bg={bgColor}
        />
      </InputGroup>
    </Flex>
  );
};

export default SearchInput;
