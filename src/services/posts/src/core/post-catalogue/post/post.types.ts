import { UniqueEntityID } from '@myforum/building-blocks';
import { Comment } from '../comment/comment.entity';
import { RawComment } from '../comment/comment.types';

export interface PostProps {
  commentToAdd: Comment | null;
  commentToEdit: Comment | null;
  commentIdToDelete: UniqueEntityID | null;
}

export interface PersistedPost {
  id: string;
}

export interface RawPost {
  id: string;
  commentToAdd: RawComment | null;
  commentToEdit: RawComment | null;
  commentIdToDelete: string | null;
}
