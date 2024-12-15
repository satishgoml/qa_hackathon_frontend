import pb from "../core/pocketbase";

export type TDataLogin = {
  email: string;
  password: string;
};

export type TDataRegister = {
  email: string;
  password: string;
  passwordConfirm: string;
};

export type TDataRecoverPassword = {
  email: string;
};

export type TDataResetPassword = {
  token: string;
  password: string;
  passwordConfirm: string;
};

export class AuthService {
  /**
   * Login User
   * Authenticate a user and store the token for future requests.
   * @param data - User credentials
   * @returns Authenticated user data
   */
  public static async login(data: TDataLogin) {
    const { email, password } = data;
    try {
      const authData = await pb
        .collection("users")
        .authWithPassword(email, password);
      return authData;
    } catch (error: any) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }
  /**
   * Logout User
   * Clears the stored authentication token.
   */
  public static logout() {
    pb.authStore.clear();
  }

  /**
   * Register User
   * Create a new user in the system.
   * @param data - Registration details
   * @returns Newly created user data
   */
  public static async register(data: TDataRegister) {
    try {
      const user = await pb.collection("users").create(data);
      return user;
    } catch (error: any) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  /**
   * Recover Password
   * Sends a password recovery email.
   * @param data - User email
   */
  public static async recoverPassword(data: TDataRecoverPassword) {
    const { email } = data;
    try {
      await pb.collection("users").requestPasswordReset(email);
    } catch (error: any) {
      throw new Error(`Password recovery failed: ${error.message}`);
    }
  }

  /**
   * Reset Password
   * Resets the user's password using a token.
   * @param data - Reset details
   */
  public static async resetPassword(data: TDataResetPassword) {
    const { token, password, passwordConfirm } = data;
    try {
      await pb
        .collection("users")
        .confirmPasswordReset(token, password, passwordConfirm);
    } catch (error: any) {
      throw new Error(`Password reset failed: ${error.message}`);
    }
  }
}

export class UserService {
  /**
   * Get Current User
   * Retrieves the currently authenticated user's data.
   * @returns Authenticated user data
   */
  public static getCurrentUser() {
    return pb.authStore.record;
  }

  /**
   * Update Current User
   * Updates the currently authenticated user's data.
   * @param data - Updated user details
   * @returns Updated user data
   */
  public static async updateCurrentUser(data: Partial<Record<string, any>>) {
    try {
      const updatedUser = await pb
        .collection("users")
        .update(pb.authStore.model?.id || "", data);
      return updatedUser;
    } catch (error: any) {
      throw new Error(`Update failed: ${error.message}`);
    }
  }

  /**
   * Delete Current User
   * Deletes the currently authenticated user's account.
   */
  public static async deleteCurrentUser() {
    try {
      await pb.collection("users").delete(pb.authStore.model?.id || "");
    } catch (error: any) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  }

  
}
