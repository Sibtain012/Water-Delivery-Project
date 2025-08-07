// UserSyncService stub - Authentication has been removed in favor of guest checkout
// This file exists only to prevent import errors from components that may still reference it

class UserSyncService {
  syncFirebaseUserToCustomerStore(_user: any): void {
    // No-op since authentication is disabled
  }

  clearSyncedCustomer(): void {
    // No-op since authentication is disabled
  }
}

export const userSyncService = new UserSyncService();
