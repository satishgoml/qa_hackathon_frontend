import {
  Container,
  Heading,
  SkeletonText,
  SimpleGrid,
  Box,
} from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { z } from "zod";

import { UserStoryService } from "@/client";
import Navbar from "@/components/Common/Navbar";
import { PaginationFooter } from "@/components/Common/PaginationFooter";
import { UserStoryCard } from "@/components/UserStory/UserStoryCard";

const userStoriesSearchSchema = z.object({
  page: z.number().catch(1),
});

export const Route = createFileRoute("/_layout/project/$projectId")({
  component: Index,
  validateSearch: (search) => userStoriesSearchSchema.parse(search),
});

const PER_PAGE = 5;

function getUserStoriesQueryOptions({
  projectId,
  page,
}: {
  projectId: string;
  page: number;
}) {
  return {
    queryFn: () =>
      UserStoryService.getUserStories({
        project_id: projectId,
        skip: (page - 1) * PER_PAGE,
        limit: PER_PAGE,
      }),
    queryKey: ["userStories", { projectId, page }],
  };
}

function UserStoriesGrid() {
  const queryClient = useQueryClient();
  const { page } = Route.useSearch();
  const { projectId } = Route.useParams(); // Get project ID from route params
  const navigate = useNavigate({ from: Route.fullPath });
  const setPage = (page: number) =>
    navigate({ search: (prev) => ({ ...prev, page }) });

  const {
    data: userStories,
    isPending,
    isPlaceholderData,
  } = useQuery({
    ...getUserStoriesQueryOptions({ projectId, page }),
    placeholderData: (prevData) => prevData,
  });

  console.log("userStories", userStories);

  const hasNextPage = !isPlaceholderData && userStories?.data.length === PER_PAGE;
  const hasPreviousPage = page > 1;

  useEffect(() => {
    if (hasNextPage) {
      queryClient.prefetchQuery(
        getUserStoriesQueryOptions({ projectId, page: page + 1 })
      );
    }
  }, [page, queryClient, hasNextPage, projectId]);

  return (
    <>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6} mt={4}>
        {isPending
          ? new Array(5).fill(null).map((_, index) => (
              <Box key={index}>
                <SkeletonText noOfLines={5} spacing="4" skeletonHeight="20px" />
              </Box>
            ))
          : userStories?.data.map((story) => (
              <UserStoryCard
                key={story.id}
                id={story.id}
                title={story.title}
                description={story.description}
                status={story.status}
                priority={story.priority}
              />
            ))}
      </SimpleGrid>
      <PaginationFooter
        page={page}
        onChangePage={setPage}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
      />
    </>
  );
}

function Index() {
  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: "center", md: "left" }} pt={12}>
        User Stories Management
      </Heading>

      <Navbar type={"UserStory"} addModalAs={"symbol"} buttonText={""} />
      <UserStoriesGrid />
    </Container>
  );
}
