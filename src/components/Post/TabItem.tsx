import React from "react";
import { TabItems } from "./NewPostForm";
import { Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";

type TabItemProps = {
  item: TabItems;
  selected: boolean;
  setSelectedTabs: (value: string) => void;
};

const TabItem: React.FC<TabItemProps> = ({
  item,
  selected,
  setSelectedTabs,
}) => {
  // Dark mode support
  const hoverBg = useColorModeValue("gray.100", "gray.700");
  const selectedColor = useColorModeValue("#2c67b3", "#5b01ee");
  const unselectedColor = useColorModeValue("gray.500", "gray.400");
  const borderBottomColor = selected ? selectedColor : useColorModeValue("gray.200", "gray.600");

  return (
    <Flex
      justify="center"
      align="center"
      p="14px 0px"
      flexGrow={1}
      cursor="pointer"
      _hover={{ bg: hoverBg }}
      fontWeight={700}
      color={selected ? selectedColor : unselectedColor}
      borderWidth={selected ? "0px 1px 2px 0px " : "0px 1px 1px 0px"}
      borderBottomColor={borderBottomColor}
      borderRightColor={useColorModeValue("gray.200", "gray.600")}
      onClick={() => setSelectedTabs(item.title)}
    >
      <Flex align="center" height="20px" mr={2}>
        <Icon as={item.icon} />
      </Flex>
      <Flex>
        <Text fontSize="10pt">{item.title}</Text>
      </Flex>
    </Flex>
  );
};

export default TabItem;
