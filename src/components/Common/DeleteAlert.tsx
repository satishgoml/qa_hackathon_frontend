import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";

import { ProjectService, UserService } from "../../client";
import useCustomToast from "../../hooks/useCustomToast";

interface DeleteProps {
  type: "User" | "Project";
  id: string;
  isOpen: boolean;
  onClose: () => void;
}

// Mapping of types to services and query keys
const entityConfig = {
  User: {
    deleteFunction: (id: string) => UserService.deleteCurrentUser(),
    queryKey: "users",
    deleteWarning:
      "All items associated with this user will also be permanently deleted.",
  },
  Project: {
    deleteFunction: (id: string) => ProjectService.deleteProject(id),
    queryKey: "projects",
    deleteWarning:
      "All items associated with this project will also be permanently deleted.",
  },
};

const Delete = ({ type, id, isOpen, onClose }: DeleteProps) => {
  const queryClient = useQueryClient();
  const showToast = useCustomToast();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  // Fetch the correct delete function and query key based on type
  const entity = entityConfig[type];

  const mutation = useMutation({
    mutationFn: () => entity.deleteFunction(id),
    onSuccess: () => {
      showToast(
        "Success",
        `The ${type.toLowerCase()} was deleted successfully.`,
        "success"
      );
      onClose();
    },
    onError: () => {
      showToast(
        "An error occurred.",
        `An error occurred while deleting the ${type.toLowerCase()}.`,
        "error"
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [entity.queryKey] });
    },
  });

  const onSubmit = () => {
    mutation.mutate();
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onClose}
      leastDestructiveRef={cancelRef}
      size={{ base: "sm", md: "md" }}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <AlertDialogHeader>Delete {type}</AlertDialogHeader>

          <AlertDialogBody>
            {entity.deleteWarning && (
              <span>
                {entity.deleteWarning} <strong>Permanently deleted.</strong>
              </span>
            )}
            Are you sure? You will not be able to undo this action.
          </AlertDialogBody>

          <AlertDialogFooter gap={3}>
            <Button variant="danger" type="submit" isLoading={isSubmitting}>
              Delete
            </Button>
            <Button ref={cancelRef} onClick={onClose} isDisabled={isSubmitting}>
              Cancel
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default Delete;
