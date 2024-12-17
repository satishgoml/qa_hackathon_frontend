import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { ApiError, ProjectService } from "@/client";
import { handleError } from "@/utils.ts";
import useCustomToast from "@/hooks/useCustomToast";
import { UserStoryService } from "@/client/services/user_story";

interface GenerateProjectProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UploadFileRequest {
  brd_document: FileList;
}

const GenerateProject = ({ isOpen, onClose }: GenerateProjectProps) => {
  const queryClient = useQueryClient();
  const showToast = useCustomToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UploadFileRequest>({
    mode: "onBlur",
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const file = data.get("brd_document");
      if (file instanceof File) {
        const project = await ProjectService.createProject(file);

        // create user stories
        await UserStoryService.generateUserStories({
          project_id: project.id,
        });

        return project;
      }
      throw new Error("Invalid file");
    },
    onSuccess: () => {
      showToast("Success!", "File uploaded successfully.", "success");
      reset();
      onClose();
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (err: ApiError) => {
      handleError(err, showToast);
    },
  });

  const onSubmit: SubmitHandler<UploadFileRequest> = (data) => {
    const formData = new FormData();
    formData.append("brd_document", data.brd_document[0]);
    mutation.mutate(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={{ base: "sm", md: "md" }}
      isCentered
    >
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>Upload Document</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {/* File Upload */}
          <FormControl isRequired isInvalid={!!errors.brd_document}>
            <FormLabel htmlFor="brd_document">Upload Document</FormLabel>
            <Input
              id="brd_document"
              type="file"
              accept=".png,.jpg,.jpeg,.pdf"
              {...register("brd_document", {
                required: "Document is required.",
              })}
            />
            {errors.brd_document && (
              <FormErrorMessage>{errors.brd_document.message}</FormErrorMessage>
            )}
          </FormControl>
        </ModalBody>

        <ModalFooter gap={3}>
          <Button
            variant="primary"
            type="submit"
            isLoading={mutation.isPending}
            isDisabled={mutation.isPending}
          >
            Upload
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GenerateProject;
