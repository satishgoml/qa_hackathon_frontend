import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiEdit, FiTrash } from "react-icons/fi";

import type { UserPublic } from "../../client";
import Delete from "./DeleteAlert";
import { useNavigate } from "@tanstack/react-router";

interface ActionsMenuProps<T> {
  type: "Project";
  value: T;
  disabled?: boolean;
}

const ActionsMenu = <T extends UserPublic>({
  type,
  value,
  disabled,
}: ActionsMenuProps<T>) => {
  const navigate = useNavigate();
  // const editModal = useDisclosure();
  const deleteModal = useDisclosure();

  const handleView = () => {
    if (type === "Project") {
      navigate({
        to: `/project/$projectId`,
        params: { projectId: value.id },
        search: {
          page: 1,
        },
      });
    }
  };

  return (
    <>
      <Menu>
        <MenuButton
          isDisabled={disabled}
          as={Button}
          rightIcon={<BsThreeDotsVertical />}
          variant="unstyled"
        />
        <MenuList>
          <MenuItem onClick={handleView} icon={<FiEdit fontSize="16px" />}>
            View {type} Info
          </MenuItem>
          <MenuItem
            onClick={deleteModal.onOpen}
            icon={<FiTrash fontSize="16px" />}
            color="ui.danger"
          >
            Delete {type}
          </MenuItem>
        </MenuList>

        <Delete
          type={type}
          id={value.id}
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.onClose}
        />
      </Menu>
    </>
  );
};

export default ActionsMenu;
