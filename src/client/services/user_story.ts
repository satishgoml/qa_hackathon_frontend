import { OpenAPI } from "../core/OpenAPI";
import pb from "../core/pocketbase";
import {
  UserStoryPublic,
  UserStoryCreate,
  UserStoryUpdate,
  CancelablePromise,
} from "@/client";
import { request as __request } from "../core/request.ts";
import { UserStoryList } from "../models/index.ts";

export type TDataReadUserStories = {
  project_id: string; // ID of the project to fetch user stories for
  skip: number; // Offset for pagination
  limit: number; // Number of items per page
};

export type TGenerateUserStories = {
  project_id: string;
};

export class UserStoryService {
  /**
   * Get Paginated User Stories for a Specific Project
   * Fetches user stories belonging to a specific project.
   * @param data - Pagination details (skip, limit) and project_id
   * @returns List of user stories
   */
  public static async getUserStories(data: TDataReadUserStories) {
    try {
      const { project_id, skip, limit } = data;

      // Ensure the user is authenticated
      const currentUser = pb.authStore.record;
      if (!currentUser) {
        throw new Error("User is not authenticated.");
      }

      // PocketBase query with filter: only fetch user stories for the specified project
      const page = Math.floor(skip / limit) + 1;
      const result = await pb
        .collection("user_story")
        .getList<UserStoryPublic>(page, limit, {
          filter: `project = "${project_id}"`, // Filter user stories by project ID
        });

      return {
        data: result.items, // List of user stories
        total: result.totalItems, // Total number of user stories
        total_pages: result.totalPages
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch user stories: ${error.message}`);
    }
  }

  /**
   * Get a User Story by ID
   * Fetches a single user story by its ID.
   * @param id - User story ID
   * @returns The user story record
   */
  public static async getUserStoryById(id: string): Promise<UserStoryPublic> {
    try {
      const record = await pb
        .collection("user_story")
        .getOne<UserStoryPublic>(id);
      return record;
    } catch (error: any) {
      throw new Error(`Failed to fetch user story: ${error.message}`);
    }
  }

  /**
   * Create a New User Story
   * @param data - Data required to create a user story
   * @returns The created user story record
   */
  public static async createUserStory(
    data: UserStoryCreate
  ): Promise<UserStoryPublic> {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("acceptance_criteria", data.acceptance_criteria);
      formData.append("priority", data.priority);
      formData.append("story_points", data.story_points.toString());
      formData.append("status", data.status);
      formData.append("user", data.user);
      formData.append("project", data.project);

      const record = await pb
        .collection("user_story")
        .create<UserStoryPublic>(formData);
      return record;
    } catch (error: any) {
      throw new Error(`Failed to create user story: ${error.message}`);
    }
  }

  /**
   * Update an Existing User Story
   * @param id - User story ID
   * @param data - Data to update the user story
   * @returns The updated user story record
   */
  public static async updateUserStory(
    id: string,
    data: UserStoryUpdate
  ): Promise<UserStoryPublic> {
    try {
      const formData = new FormData();
      if (data.title) formData.append("title", data.title);
      if (data.description) formData.append("description", data.description);
      if (data.acceptance_criteria)
        formData.append("acceptance_criteria", data.acceptance_criteria);
      if (data.priority) formData.append("priority", data.priority);
      if (data.story_points !== undefined)
        formData.append("story_points", data.story_points.toString());
      if (data.status) formData.append("status", data.status);
      if (data.user) formData.append("user", data.user);
      if (data.project) formData.append("project", data.project);

      const record = await pb
        .collection("user_story")
        .update<UserStoryPublic>(id, formData);
      return record;
    } catch (error: any) {
      throw new Error(`Failed to update user story: ${error.message}`);
    }
  }

  /**
   * Delete a User Story
   * @param id - User story ID
   * @returns void
   */
  public static async deleteUserStory(id: string): Promise<void> {
    try {
      await pb.collection("user_story").delete(id);
    } catch (error: any) {
      throw new Error(`Failed to delete user story: ${error.message}`);
    }
  }

  /**
   * Fetch Paginated User Stories for a Specific Project
   * Fetches user stories belonging to a specific project.
   * @param data - Pagination details (skip, limit) and project_id
   * @returns List of user stories
   */
  public static generateUserStories(
    data: TGenerateUserStories
  ): CancelablePromise<UserStoryList> {
    const { project_id } = data;

    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/user_story/generate_from_pdf",
      query: {
        project_id, // Filter user stories by 
      },
      errors: {
        422: "Validation Error",
      },
    });
  }
}
