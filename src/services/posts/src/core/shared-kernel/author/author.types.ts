import { AuthorStatus } from '@core/shared-kernel/author-status/author-status.value-object';

export interface AuthorProps {
  status: AuthorStatus;
}

export interface RawAuthor {
  id: string;
  status: string;
}
