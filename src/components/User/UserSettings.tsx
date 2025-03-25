import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Switch,
  useColorMode,
} from "@chakra-ui/react";
import { User } from "firebase/auth";

type UserSettingsProps = {
  user?: User | null;
};

const UserSettings: React.FC<UserSettingsProps> = ({user}) => {
  const { colorMode, toggleColorMode } = useColorMode();

  // Local state for input fields
  const [username, setUsername] = useState(user?.displayName);
  const [email, setEmail] = useState(user?.email);

  const handleSave = () => {
    // Update global state with new values

    // TODO: Add Firestore update logic here
    console.log("Updated User Settings:", {
      username,
      email,
      darkMode: colorMode === "dark",
    });
  };

  return (
    <Box maxW="400px" mx="auto" mt={10} p={5} borderWidth={1} borderRadius="lg">
      <Heading size="lg" mb={5}>
        User Settings
      </Heading>
      {
        user && 
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input
            value={username || ""}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter new username"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            value={email || ""}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter new email"
          />
        </FormControl>

        <FormControl display="flex" alignItems="center">
          <FormLabel mb="0">Dark Mode</FormLabel>
          <Switch isChecked={colorMode === "dark"} onChange={toggleColorMode} />
        </FormControl>

        <Button colorScheme="blue" onClick={handleSave}>
          Save Changes
        </Button>
      </VStack>
      }
    </Box>
  );
};

export default UserSettings;
