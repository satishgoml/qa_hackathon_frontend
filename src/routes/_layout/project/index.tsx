import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  SkeletonText,
  Container,
  Heading,
} from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { ProjectService, TDataReadProjects } from "@/client";
import { PaginationFooter } from "@/components/Common/PaginationFooter";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import Navbar from "@/components/Common/Navbar";
import GenerateProject from "@/components/Projects/GenerateProject";
import ActionsMenu from "@/components/Common/ActionsMenu";

const projectSearchSchema = z.object({
  page: z.number().catch(1),
});

export const Route = createFileRoute("/_layout/project/")({
  component: Index,
  validateSearch: (search) => projectSearchSchema.parse(search),
});

const PER_PAGE = 5;

function getProjectsQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      ProjectService.getProjects({
        skip: (page - 1) * PER_PAGE,
        limit: PER_PAGE,
      } as TDataReadProjects),
    queryKey: ["projects", { page }],
  };
}

function ProjectsTable() {
  const queryClient = useQueryClient();
  const { page } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const setPage = (newPage: number) =>
    navigate({ search: (prev) => ({ ...prev, page: newPage }) });

  const {
    data: projects,
    isLoading,
    isFetching,
    isPlaceholderData,
  } = useQuery({
    ...getProjectsQueryOptions({ page }),
    placeholderData: () => {
      const previousPage = page > 1 ? page - 1 : 1;
      return queryClient.getQueryData(["projects", { page: previousPage }]);
    },
  });

  const hasNextPage = !isPlaceholderData && projects?.data.length === PER_PAGE;
  const hasPreviousPage = page > 1;

  useEffect(() => {
    if (hasNextPage) {
      queryClient.prefetchQuery(getProjectsQueryOptions({ page: page + 1 }));
    }
  }, [page, queryClient, hasNextPage]);

  return (
    <>
      <TableContainer>
        <Table size={{ base: "sm", md: "md" }}>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Document</Th>
              <Th>Owner</Th>
              <Th>Created At</Th>
            </Tr>
          </Thead>
          <Tbody>
            {(isLoading || isFetching) && (
              <>
                {new Array(PER_PAGE).fill(null).map((_, index) => (
                  <Tr key={index}>
                    <Td>
                      <SkeletonText noOfLines={1} />
                    </Td>
                    <Td>
                      <SkeletonText noOfLines={1} />
                    </Td>
                    <Td>
                      <SkeletonText noOfLines={1} />
                    </Td>
                    <Td>
                      <SkeletonText noOfLines={1} />
                    </Td>
                  </Tr>
                ))}
              </>
            )}
            {!isLoading &&
              projects?.data.map((project: any) => (
                <Tr key={project.id} opacity={isFetching ? 0.5 : 1}>
                  <Td>{project.id}</Td>
                  <Td isTruncated maxWidth="200px">
                    {project.brd_document || "N/A"}
                  </Td>
                  <Td isTruncated maxWidth="150px">
                    {project.user || "Unknown"}
                  </Td>
                  <Td isTruncated maxWidth="150px">
                    {new Date(project.created).toLocaleDateString()}
                  </Td>
                  <Td>
                    <ActionsMenu type="Project" value={project} />
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
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
        Project Management
      </Heading>
      <Navbar
        type={"Project"}
        addModalAs={GenerateProject}
        buttonText={"Generate"}
      />
      <ProjectsTable />
    </Container>
  );
}
