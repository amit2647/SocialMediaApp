import React from "react";
import {
  Flex,
  Icon,
  MenuItem,
  Image,
  useColorModeValue,
  useToken,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import useDirectory from "../../../hooks/useDirectory";

type DirectoryItemProps = {
  displayText: string;
  link: string;
  icon: IconType;
  iconColor: string;
  imageURL?: string;
};

const MenuListItem: React.FC<DirectoryItemProps> = ({
  displayText,
  link,
  icon,
  iconColor,
  imageURL,
}) => {
  const { onSelectMenuItem } = useDirectory();

  //  Fetch colors from Chakra theme properly
  const [hoverBgLight, hoverBgDark, textLight, textDark, iconDark] = useToken(
    "colors",
    [
      "menuListItem.hoverBgLight",
      "menuListItem.hoverBgDark",
      "menuListItem.textLight",
      "menuListItem.textDark",
      "menuListItem.iconDark",
    ]
  );

  const hoverBg = useColorModeValue(hoverBgLight, hoverBgDark);
  const textColor = useColorModeValue(textLight, textDark);
  const adjustedIconColor = useColorModeValue(iconColor, iconDark);

  return (
    <MenuItem
      width="100%"
      fontSize="9pt"
      color={textColor}
      transition="background 0.2s ease-in-out"
      _hover={{ bg: hoverBg }}
      onClick={() =>
        onSelectMenuItem({ displayText, link, icon, iconColor, imageURL })
      }
    >
      <Flex alignItems="center">
        {imageURL ? (
          <Image borderRadius="full" boxSize="18px" src={imageURL} mr={2} />
        ) : (
          <Icon fontSize={20} mr={2} as={icon} color={adjustedIconColor} />
        )}
        {displayText}
      </Flex>
    </MenuItem>
  );
};

export default MenuListItem;
