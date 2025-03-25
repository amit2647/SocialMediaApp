import { Flex, Icon, useColorModeValue, useTheme } from "@chakra-ui/react";
import React from "react";
import { BsArrowUpRightCircle, BsChatDots } from "react-icons/bs";
import { GrAdd } from "react-icons/gr";
import {
  IoFilterCircleOutline,
  IoNotificationsOutline,
  IoVideocamOutline,
} from "react-icons/io5";

const Icons: React.FC = () => {
  const theme = useTheme();

  // Fetch theme colors
  const hoverBg = useColorModeValue(
    theme.colors.icons.hoverBgLight,
    theme.colors.icons.hoverBgDark
  );
  const iconColor = useColorModeValue(
    theme.colors.icons.iconColorLight,
    theme.colors.icons.iconColorDark
  );
  const borderColor = useColorModeValue(
    theme.colors.icons.borderColorLight,
    theme.colors.icons.borderColorDark
  );

  return (
    <Flex>
      <Flex
        display={{ base: "none", md: "flex" }}
        align="center"
        borderRight="1px solid"
        borderColor={borderColor}
      >
        {[BsArrowUpRightCircle, IoFilterCircleOutline, IoVideocamOutline].map(
          (IconComponent, index) => (
            <Flex
              key={index}
              mr={1.5}
              ml={1.5}
              padding={1}
              cursor="pointer"
              borderRadius={4}
              _hover={{ bg: hoverBg }}
            >
              <Icon as={IconComponent} color={iconColor} />
            </Flex>
          )
        )}
      </Flex>

      {[BsChatDots, IoNotificationsOutline].map((IconComponent, index) => (
        <Flex
          key={index}
          mr={1.5}
          ml={1.5}
          padding={1}
          cursor="pointer"
          borderRadius={4}
          _hover={{ bg: hoverBg }}
        >
          <Icon as={IconComponent} color={iconColor} />
        </Flex>
      ))}

      <Flex
        display={{ base: "none", md: "flex" }}
        mr={1.5}
        ml={1.5}
        padding={1}
        cursor="pointer"
        borderRadius={4}
        _hover={{ bg: hoverBg }}
      >
        <Icon as={GrAdd} color={iconColor} />
      </Flex>
    </Flex>
  );
};

export default Icons;
