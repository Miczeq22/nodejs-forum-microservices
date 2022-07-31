export interface CommentStatusProps {
  value: string;
}

export enum CommentStatusValue {
  Active = 'Active',
  Banned = 'Banned',
  Deleted = 'Deleted',
}
