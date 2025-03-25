import { authModalState } from "@/atoms/authModalAtom";
import { Input, Button, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/clientApp";
import { FIREBASE_ERRORS } from "@/firebase/errors";
import { User } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";

const SignUp: React.FC = () => {
  const setAuthModalState = useSetRecoilState(authModalState);
  const [signUpForm, setSignUpForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [createUserWithEmailAndPassword, userCred, loading, userError] =
    useCreateUserWithEmailAndPassword(auth);

  // Colors for Dark Mode
  const inputBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("#2c67b3", "#4d04cb");
  const textColor = useColorModeValue("#2c67b3", "#4d04cb");

  // Firebase Logic
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (error) setError("");
    if (signUpForm.password !== signUpForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    createUserWithEmailAndPassword(signUpForm.email, signUpForm.password);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const createUserDocument = async (user: User) => {
    await addDoc(
      collection(firestore, "users"),
      JSON.parse(JSON.stringify(user))
    );
  };

  useEffect(() => {
    if (userCred) {
      createUserDocument(userCred.user);
    }
  }, [userCred]);

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
      <Input
        required
        name="confirmPassword"
        placeholder="Confirm Password"
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

      {(error || userError) && (
        <Text textAlign="center" color="red.500" fontSize="10pt">
          {error ||
            FIREBASE_ERRORS[userError?.message as keyof typeof FIREBASE_ERRORS]||
            userError?.message} {/* Fallback to raw error message */}
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
        Sign Up
      </Button>
      <Flex fontSize="9pt" justifyContent="center">
        <Text mr={1}>Already a user?</Text>
        <Text
          color={textColor}
          fontWeight={700}
          cursor="pointer"
          onClick={() => {
            setAuthModalState((prev) => ({
              ...prev,
              view: "login",
            }));
          }}
          _hover={{ textDecoration: "underline" }}
        >
          Login
        </Text>
      </Flex>
    </form>
  );
};

export default SignUp;
