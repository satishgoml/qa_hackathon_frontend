import React, { useState } from "react";
import {
  Box,
  Text,
  VStack,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { TestCaseService } from "@/client"; // Replace with your actual service import

interface UserStoryCardProps {
  title: string;
  description: string;
  status: string;
  priority: string;
  id: string; // userStoryId for fetching test cases
}

// Function to fetch test cases
const fetchTestCases = async (userStoryId: string) => {
  console.log("Fetching test cases...");
  const response = await TestCaseService.getTestCases({
    user_story_id: userStoryId,
    skip: 0,
    limit: 10,
  });
  console.log("Test cases fetched:", response);
  return response.data;
};

export const UserStoryCard: React.FC<UserStoryCardProps> = ({
  title,
  description,
  status,
  priority,
  id,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [isGenerating, setIsGenerating] = useState(false); // Local state for generating test cases

  // Fetch test cases using useQuery
  const {
    data: testCases,
    isLoading: isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["testCases", id],
    queryFn: () => fetchTestCases(id),
    enabled: isOpen, // Fetch only when modal is open
  });

  // Function to generate test cases
  const handleGenerateTestCases = async () => {
    setIsGenerating(true); // Start generating state
    try {
      toast({
        title: "Generating Test Cases...",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      await TestCaseService.generateTestCases({ user_story_id: id });
      await refetch(); // Refetch test cases after generation
      toast({
        title: "Test Cases Generated",
        description: "The test cases were generated successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error generating test cases:", error);
      toast({
        title: "Error",
        description: "Failed to generate test cases.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsGenerating(false); // Stop generating state
    }
  };

  return (
    <>
      {/* Card Component */}
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        p={4}
        boxShadow="md"
        _hover={{
          transform: "scale(1.02)",
          transition: "all 0.2s ease-in-out",
        }}
      >
        <VStack align="start" spacing={2}>
          <Text fontWeight="bold" fontSize="lg">
            {title}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {description}
          </Text>
          <Text fontSize="sm">
            <strong>Status:</strong> {status}
          </Text>
          <Text fontSize="sm">
            <strong>Priority:</strong> {priority}
          </Text>
          <Button onClick={onOpen} colorScheme="blue" size="sm">
            View Testcases
          </Button>
        </VStack>
      </Box>

      {/* Modal for Test Cases */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Test Cases for {title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isFetching ? (
              <Box textAlign="center" py={4}>
                <Spinner size="xl" color="blue.500" />
                <Text mt={2}>Loading test cases...</Text>
              </Box>
            ) : isError ? (
              <Text color="red.500">Error loading test cases.</Text>
            ) : testCases && testCases.length > 0 ? (
              <VStack align="start" spacing={3}>
                <Text fontWeight="bold">Test Cases:</Text>
                {testCases.map((testCase) => (
                  <Box
                    key={testCase.id}
                    borderWidth="1px"
                    borderRadius="md"
                    padding="3"
                    width="100%"
                  >
                    <Text fontWeight="semibold">{testCase.name}</Text>
                    <Text fontSize="sm" color="gray.600">
                      {testCase.description}
                    </Text>
                  </Box>
                ))}
              </VStack>
            ) : (
              <Box textAlign="center" py={4}>
                <Text>No test cases found.</Text>
                <Button
                  colorScheme="blue"
                  onClick={handleGenerateTestCases}
                  isLoading={isGenerating} // State variable for loading
                  loadingText="Generating..."
                  mt="4"
                >
                  Generate Testcases
                </Button>
              </Box>
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
