import pb from "../core/pocketbase";
import { ProjectPublic, ProjectUpdate } from "../models/project";

export type TDataReadProjects = {
  skip: number; // Offset for pagination
  limit: number; // Number of items per page
};

export class ProjectService {
  /**
   * Get Paginated Projects for the Current User
   * Fetches projects belonging to the currently authenticated user.
   * @param data - Pagination details (skip and limit)
   * @returns List of projects
   */
  public static async getProjects(data: TDataReadProjects) {
    try {
      const { skip, limit } = data;

      // Ensure the user is authenticated
      const currentUser = pb.authStore.record;
      if (!currentUser) {
        throw new Error("User is not authenticated.");
      }

      // PocketBase query with filter: only fetch projects where 'owner' matches current user's ID
      const page = Math.floor(skip / limit) + 1;
      const result = await pb
        .collection("project")
        .getList<ProjectPublic>(page, limit, {
          filter: `user = "${currentUser.id}"`, // Filter projects for the current user
        });

      return {
        data: result.items, // List of projects
        total: result.totalItems, // Total number of projects
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch projects: ${error.message}`);
    }
  }

  public static async getProjectById(id: string): Promise<ProjectPublic> {
    try {
      const record = await pb.collection("project").getOne<ProjectPublic>(id);
      return record;
    } catch (error: any) {
      throw new Error(`Failed to fetch project: ${error.message}`);
    }
  }

  public static async createProject(
    brd_document: File
  ): Promise<ProjectPublic> {
    try {
      const formData = new FormData();
      const user = pb.authStore.record;
      formData.append("user", user?.id!);
      formData.append("brd_document", brd_document!);
      const record = await pb
        .collection("project")
        .create<ProjectPublic>(formData);
      return record;
    } catch (error: any) {
      throw new Error(`Failed to create project: ${error.message}`);
    }
  }

  public static async updateProject(
    id: string,
    data: ProjectUpdate
  ): Promise<ProjectPublic> {
    try {
      const formData = new FormData();
      if (data.user) formData.append("user", data.user);
      if (data.brd_document) {
        formData.append("brd_document", data.brd_document);
      }
      const record = await pb
        .collection("project")
        .update<ProjectPublic>(id, formData);
      return record;
    } catch (error: any) {
      throw new Error(`Failed to update project: ${error.message}`);
    }
  }

  public static async deleteProject(id: string): Promise<void> {
    try {
      await pb.collection("project").delete(id);
    } catch (error: any) {
      throw new Error(`Failed to delete project: ${error.message}`);
    }
  }
}
