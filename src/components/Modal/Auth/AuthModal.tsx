import { authModalState } from "@/atoms/authModalAtom";
import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Flex,
  Text,
  Spinner,
  useColorModeValue, // Import Dark Mode utility
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import AuthInputs from "./AuthInputs";
import OAuthButtons from "./OAuthButtons";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import ResetPassword from "./ResetPassword";

const AuthModal: React.FC = () => {
  const [modalState, setModalState] = useRecoilState(authModalState);
  const [user, loading, error] = useAuthState(auth);

  const handleClose = () => {
    if (!loading) {
      setModalState((prev) => ({
        ...prev,
        open: false,
      }));
    }
  };

  useEffect(() => {
    if (user) handleClose();
    console.log("user", user);
  }, [user, loading]);

  // Dark Mode Styling
  const modalBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.400", "gray.500");
  const spinnerColor = useColorModeValue("blue.500", "#4d04cb");

  return (
    <Modal isOpen={modalState.open} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent bg={modalBg}>
        <ModalHeader textAlign="center">
          {modalState.view === "login" && "Login"}
          {modalState.view === "signup" && "Sign Up"}
          {modalState.view === "resetPassword" && "Reset Password"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          {loading ? ( // Show Spinner while loading
            <Flex align="center" justify="center" height="100px">
              <Spinner size="xl" color={spinnerColor} />
            </Flex>
          ) : (
            <Flex
              direction="column"
              align="center"
              justify="center"
              width="70%"
              pb={6}
            >
              {modalState.view === "login" || modalState.view === "signup" ? (
                <>
                  <OAuthButtons />
                  <Text color={textColor} fontWeight={700}>
                    OR
                  </Text>
                  <AuthInputs />
                </>
              ) : (
                <ResetPassword />
              )}
            </Flex>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AuthModal;
