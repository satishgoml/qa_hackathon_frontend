import {Box, Flex, Icon, Text, useColorModeValue} from "@chakra-ui/react"
import {useQueryClient} from "@tanstack/react-query"
import {Link} from "@tanstack/react-router"
import {
    FiHome,  FiSettings, FiUsers,FiFolder
} from "react-icons/fi"

import type {UserPublic} from "@/client"

const primaryItems = [
    {icon: FiHome, title: "Dashboard", path: "/"},
    {icon: FiSettings, title: "User Settings", path: "/settings"},
    {icon: FiFolder, title: "Projects", path: "/project"},
]



interface SidebarItemsProps {
    onClose?: () => void
}

const SidebarItems = ({onClose}: SidebarItemsProps) => {
    const queryClient = useQueryClient()
    const textColor = useColorModeValue("ui.dark", "ui.light")
    const bgActive = useColorModeValue("#E2E8F0", "#4A5568")
    const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"])

    const finalPrimaryItems = currentUser?.is_superuser
        ? [...primaryItems, {icon: FiUsers, title: "Admin", path: "/admin"}]
        : primaryItems

    const renderItems = (items: Array<{icon: any, title: string, path: string}>) =>
        items.map(({icon, title, path}) => (
            <Flex
                as={Link}
                to={path}
                w="100%"
                p={2}
                key={title}
                activeProps={{
                    style: {
                        background: bgActive,
                        borderRadius: "12px",
                    },
                }}
                color={textColor}
                onClick={onClose}
            >
                <Icon as={icon} alignSelf="center" />
                <Text ml={2}>{title}</Text>
            </Flex>
        ))

    return (
        <Box>
            {renderItems(finalPrimaryItems)}
        </Box>
    )
}

export default SidebarItems