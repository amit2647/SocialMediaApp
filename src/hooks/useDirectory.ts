import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { communityState } from "../atoms/communitiesAtom";
import {
  defaultMenuItem,
  DirectoryMenuItem,
  directoryMenuState,
} from "../atoms/directoryMenuAtom";
import { FaUserCircle } from "react-icons/fa";

const useDirectory = () => {
  const [directoryState, setDirectoryState] =
    useRecoilState(directoryMenuState);
  const router = useRouter();
  const { community } =useParams();

  const communityStateValue = useRecoilValue(communityState);

  const onSelectMenuItem = (menuItem: DirectoryMenuItem) => {
    setDirectoryState((prev) => ({
      ...prev,
      selectedMenuItem: menuItem,
    }));

    router?.push(menuItem.link);
    if (directoryState.isOpen) {
      toggleMenuOpen();
    }
  };

  const toggleMenuOpen = () => {
    setDirectoryState((prev) => ({
      ...prev,
      isOpen: !directoryState.isOpen,
    }));
  };

  useEffect(() => {

    // const existingCommunity =
    //   communityStateValue.visitedCommunities[community as string];

    const existingCommunity = communityStateValue.currentCommunity;

    if (existingCommunity.id) {
      setDirectoryState((prev) => ({
        ...prev,
        selectedMenuItem: {
          displayText: `${existingCommunity.id}`,
          link: `${existingCommunity.id}`,
          icon: FaUserCircle,
          iconColor: "#2c67b3",
          imageURL: existingCommunity.imageURL,
        },
      }));
      return;
    }
    setDirectoryState((prev) => ({
      ...prev,
      selectedMenuItem: defaultMenuItem,
    }));
  }, [communityStateValue.currentCommunity]);
  //                              ^ used to be communityStateValue.vistedCommunities

  return { directoryState, onSelectMenuItem, toggleMenuOpen };
};

export default useDirectory;