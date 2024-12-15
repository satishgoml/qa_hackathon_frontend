import { ListResult, RecordModel } from "pocketbase";

export interface ProjectPublic extends RecordModel {
  user: string;
  brd_document?: string | null;
}

export interface ProjectCreate {
    brd_document?:  File | null;
}


export interface ProjectUpdate {
  user?: string | null;
  brd_document?: File | null;
}

// Using ListResult generic type from PocketBase
export type ProjectList = ListResult<ProjectPublic>;