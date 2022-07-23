export interface AccountEmailChecker {
  isUnique(email: string): Promise<boolean>;
}
