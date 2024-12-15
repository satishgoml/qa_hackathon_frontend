import React from "react";
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
import { TestCaseService } from "@/client"; // Assuming you have a service to fetch test cases

interface UserStoryCardProps {
  title: string;
  description: string;
  status: string;
  priority: string;
  id: string; // Added userStoryId for fetching test cases
}

const fetchTestCases = async (userStoryId: string) => {
  const response = await TestCaseService.getTestCases({
    user_story_id: userStoryId,
    skip: 0,
    limit: 10,
  });
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

  // Fetch test cases using useQuery inside the modal
  const {
    data: testCases,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["testCases", id],
    queryFn: () => fetchTestCases(id),
    enabled: isOpen, // Only fetch when the modal is open
  });

  const handleGenerateTestCases = async () => {
    try {
      await TestCaseService.generateTestCases({ user_story_id: id });
      refetch(); // Refetch test cases after generating them
      toast({
        title: "Test Cases Generated",
        description: "The test cases were generated successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate test cases.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
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

      {/* Modal for Testcases */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Test Cases for {title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isLoading ? (
              <Spinner />
            ) : isError ? (
              <Text color="red.500">Error loading test cases</Text>
            ) : testCases && testCases.length > 0 ? (
              <VStack align="start" spacing={2}>
                <Text fontWeight="bold">Test Cases:</Text>
                {testCases.map((testCase) => (
                  <Box key={testCase.id} borderBottom="1px solid" padding="2">
                    <Text>{testCase.name}</Text>
                    <Text fontSize="sm">{testCase.description}</Text>
                  </Box>
                ))}
              </VStack>
            ) : (
              <Box textAlign="center">
                <Text>No test cases found.</Text>
                <Button
                  colorScheme="blue"
                  onClick={handleGenerateTestCases}
                  isLoading={isLoading}
                  loadingText="Generating"
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
