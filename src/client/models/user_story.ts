import { RecordModel, ListResult } from "pocketbase";

export interface UserStoryPublic extends RecordModel {
  title: string;
  description: string;
  acceptance_criteria: string;
  priority: string;
  story_points: number;
  status: string;
  user: string; // Relation to user record ID
  project: string; // Relation to project record ID
  created: string; // ISO timestamp
  updated: string; // ISO timestamp
}

export interface UserStoryCreate {
  title: string;
  description: string;
  acceptance_criteria: string;
  priority: string;
  story_points: number;
  status: string;
  user: string; // Relation to user record ID
  project: string; // Relation to project record ID
}

export interface UserStoryUpdate {
  title?: string;
  description?: string;
  acceptance_criteria?: string;
  priority?: string;
  story_points?: number;
  status?: string;
  user?: string; // Optional for updates
  project?: string; // Optional for updates
}

// Using ListResult generic type from PocketBase
export type UserStoryList = ListResult<UserStoryPublic>;