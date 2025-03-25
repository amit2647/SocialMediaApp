import { authModalState } from "@/atoms/authModalAtom";
import { auth } from "@/firebase/clientApp";
import { FIREBASE_ERRORS } from "@/firebase/errors";
import { Button, Flex, Input, Text, useColorModeValue } from "@chakra-ui/react";
import React, { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";

const Login: React.FC = () => {
  const setAuthModalState = useSetRecoilState(authModalState);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  // Colors for Dark Mode
  const inputBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("#2c67b3", "#4d04cb");
  const textColor = useColorModeValue("#2c67b3", "#4d04cb");

  // Firebase Logic
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    signInWithEmailAndPassword(loginForm.email, loginForm.password);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <form onSubmit={onSubmit}>
      <Input
        required
        name="email"
        placeholder="Email"
        type="email"
        mb={2}
        onChange={onChange}
        fontSize="10pt"
        _placeholder={{ color: "gray.500" }}
        _hover={{
          bg: inputBg,
          border: "1px solid",
          borderColor: borderColor,
        }}
        _focus={{
          outline: "none",
          bg: inputBg,
          border: "1px solid",
          borderColor: borderColor,
        }}
        bg={inputBg}
      />
      <Input
        required
        name="password"
        placeholder="Password"
        type="password"
        mb={2}
        onChange={onChange}
        fontSize="10pt"
        _placeholder={{ color: "gray.500" }}
        _hover={{
          bg: inputBg,
          border: "1px solid",
          borderColor: borderColor,
        }}
        _focus={{
          outline: "none",
          bg: inputBg,
          border: "1px solid",
          borderColor: borderColor,
        }}
        bg={inputBg}
      />
      {error && (
        <Text textAlign="center" color="red.500" fontSize="10pt">
          {FIREBASE_ERRORS[error?.message as keyof typeof FIREBASE_ERRORS]}
        </Text>
      )}
      <Button
        width="100%"
        height="36px"
        mt={2}
        mb={2}
        type="submit"
        isLoading={loading}
        bg={borderColor}
        color="white"
        _hover={{ bg: useColorModeValue("blue.500", "blue.600") }}
      >
        Log In
      </Button>
      <Flex justifyContent="center" mb={2}>
        <Text fontSize="9pt" mr={1}>
          Forgot your password?
        </Text>
        <Text
          fontSize="9pt"
          color={textColor}
          fontWeight={700}
          cursor="pointer"
          onClick={() =>
            setAuthModalState((prev) => ({
              ...prev,
              view: "resetPassword",
            }))
          }
          _hover={{ textDecoration: "underline" }}
        >
          Reset
        </Text>
      </Flex>
      <Flex fontSize="9pt" justifyContent="center">
        <Text mr={1}>New here?</Text>
        <Text
          color={textColor}
          fontWeight={700}
          cursor="pointer"
          onClick={() =>
            setAuthModalState((prev) => ({
              ...prev,
              view: "signup",
            }))
          }
          _hover={{ textDecoration: "underline" }}
        >
          Sign Up
        </Text>
      </Flex>
    </form>
  );
};

export default Login;
