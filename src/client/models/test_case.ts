import { RecordModel, ListResult } from "pocketbase";

export interface TestCasePublic extends RecordModel {
  name: string;
  description: string;
  preconditions: string;
  steps: string;
  expected_result: string;
  user_story: string; // Relation to user story record ID
  created: string; // ISO timestamp
  updated: string; // ISO timestamp
}

export interface TestCaseCreate {
  name: string;
  description: string;
  preconditions: string;
  steps: string;
  expected_result: string;
  user_story: string; // Relation to user story record ID
}

export interface TestCaseUpdate {
  name?: string;
  description?: string;
  preconditions?: string;
  steps?: string;
  expected_result?: string;
  user_story?: string; // Optional for updates
}

// Using ListResult generic type from PocketBase
export type TestCaseList = ListResult<TestCasePublic>;
