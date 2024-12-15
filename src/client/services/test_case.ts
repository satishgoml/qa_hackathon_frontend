import { OpenAPI } from "../core/OpenAPI";
import pb from "../core/pocketbase";
import {
  TestCasePublic,
  TestCaseCreate,
  TestCaseUpdate,
  CancelablePromise,
} from "@/client";
import { request as __request } from "../core/request.ts";
import { TestCaseList } from "../models/index.ts";

export type TDataReadTestCases = {
  user_story_id: string; // ID of the user story to fetch test cases for
  skip: number; // Offset for pagination
  limit: number; // Number of items per page
};

export type TGenerateTestCases = {
  user_story_id: string; // ID of the user story for which to generate test cases
};

export class TestCaseService {
  /**
   * Get Paginated Test Cases for a Specific User Story
   * Fetches test cases belonging to a specific user story.
   * @param data - Pagination details (skip, limit) and user_story_id
   * @returns List of test cases
   */
  public static async getTestCases(data: TDataReadTestCases) {
    try {
      const { user_story_id, skip, limit } = data;

      // Ensure the user is authenticated
      const currentUser = pb.authStore.record;
      if (!currentUser) {
        throw new Error("User is not authenticated.");
      }

      // PocketBase query with filter: only fetch test cases for the specified user story
      const page = Math.floor(skip / limit) + 1;
      const result = await pb
        .collection("test_case")
        .getList<TestCasePublic>(page, limit, {
          filter: `user_story = "${user_story_id}"`, // Filter test cases by user story ID
        });

      return {
        data: result.items, // List of test cases
        total: result.totalItems, // Total number of test cases
        total_pages: result.totalPages,
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch test cases: ${error.message}`);
    }
  }

  /**
   * Get a Test Case by ID
   * Fetches a single test case by its ID.
   * @param id - Test case ID
   * @returns The test case record
   */
  public static async getTestCaseById(id: string): Promise<TestCasePublic> {
    try {
      const record = await pb
        .collection("test_case")
        .getOne<TestCasePublic>(id);
      return record;
    } catch (error: any) {
      throw new Error(`Failed to fetch test case: ${error.message}`);
    }
  }

  /**
   * Create a New Test Case
   * @param data - Data required to create a test case
   * @returns The created test case record
   */
  public static async createTestCase(
    data: TestCaseCreate
  ): Promise<TestCasePublic> {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("preconditions", data.preconditions);
      formData.append("steps", data.steps);
      formData.append("expected_result", data.expected_result);
      formData.append("user_story", data.user_story);

      const record = await pb
        .collection("test_case")
        .create<TestCasePublic>(formData);
      return record;
    } catch (error: any) {
      throw new Error(`Failed to create test case: ${error.message}`);
    }
  }

  /**
   * Update an Existing Test Case
   * @param id - Test case ID
   * @param data - Data to update the test case
   * @returns The updated test case record
   */
  public static async updateTestCase(
    id: string,
    data: TestCaseUpdate
  ): Promise<TestCasePublic> {
    try {
      const formData = new FormData();
      if (data.name) formData.append("name", data.name);
      if (data.description) formData.append("description", data.description);
      if (data.preconditions)
        formData.append("preconditions", data.preconditions);
      if (data.steps) formData.append("steps", data.steps);
      if (data.expected_result)
        formData.append("expected_result", data.expected_result);
      if (data.user_story) formData.append("user_story", data.user_story);

      const record = await pb
        .collection("test_case")
        .update<TestCasePublic>(id, formData);
      return record;
    } catch (error: any) {
      throw new Error(`Failed to update test case: ${error.message}`);
    }
  }

  /**
   * Delete a Test Case
   * @param id - Test case ID
   * @returns void
   */
  public static async deleteTestCase(id: string): Promise<void> {
    try {
      await pb.collection("test_case").delete(id);
    } catch (error: any) {
      throw new Error(`Failed to delete test case: ${error.message}`);
    }
  }

  /**
   * Generate Test Cases for a Specific User Story
   * This method generates test cases based on the user story details.
   * @param data - The user story ID for which to generate test cases
   * @returns Generated test cases
   */
  public static generateTestCases(
    data: TGenerateTestCases
  ): CancelablePromise<TestCaseList> {
    const { user_story_id } = data;

    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/test_case/generate_from_user_story",
      query: {
        user_story_id, // The ID of the user story to generate test cases for
      },
      errors: {
        422: "Validation Error",
      },
    });
  }
}
