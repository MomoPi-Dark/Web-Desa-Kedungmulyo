import bcrypt from "bcryptjs";
import {
  User as FirebaseUser,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  Unsubscribe,
  where,
} from "firebase/firestore";
import { firestore } from "./firebase";

export enum UserError {
  UserAlreadyExists = "User Already Exists",
  UserNotFound = "User Not Found",
  FetchUsersFailed = "Failed to Fetch Users",
  CreateUserFailed = "Failed to Create User",
  UpdateUserFailed = "Failed to Update User",
  DeleteUserFailed = "Failed to Delete User",
  LoginFailed = "Failed to Log In",
  LogoutFailed = "Failed to Log Out",
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: "Admin" | "User";
  createdAt: Timestamp;
  updatedAt: Timestamp;
  priority: "System" | "Public";
}

export interface UserPayload extends Omit<User, "password"> {}
export interface UserCreate
  extends Omit<User, "id" | "createdAt" | "updatedAt"> {}

class UserStore {
  private db = firestore;
  private auth = getAuth();
  private collectionName = "users";

  /**
   * Fetch all users without subscribing to changes.
   */
  async fetchAllUsers(): Promise<UserPayload[]> {
    const collectionRef = collection(this.db, this.collectionName);
    try {
      const querySnapshot = await getDocs(query(collectionRef));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as UserPayload[];
    } catch (error) {
      return Promise.reject(UserError.FetchUsersFailed);
    }
  }

  /**
   * Subscribe to changes in the "users" collection.
   */
  subscribe(callback: (users: UserPayload[]) => void): Unsubscribe {
    const collectionRef = collection(this.db, this.collectionName);
    return onSnapshot(query(collectionRef), (querySnapshot) => {
      const usersArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as UserPayload[];
      callback(usersArray);
    });
  }

  /**
   * Create a new user.
   */
  async createUser(newUser: Omit<UserCreate, "session">): Promise<void> {
    try {
      const usr = await this.getUser(newUser.email, "email").catch(() => null);

      if (usr) {
        return Promise.reject(UserError.UserAlreadyExists);
      }

      const hashedPassword = await bcrypt.hash(newUser.password, 10);
      await addDoc(collection(this.db, this.collectionName), {
        ...newUser,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (error) {
      return Promise.reject(UserError.CreateUserFailed);
    }
  }

  /**
   * Update an existing user by ID.
   */
  async updateUser(
    userId: string,
    updatedUser: Partial<UserPayload>,
  ): Promise<void> {
    try {
      const userRef = doc(this.db, this.collectionName, userId);

      await setDoc(
        userRef,
        { ...updatedUser, updatedAt: new Date() },
        { merge: true },
      );
    } catch (error) {
      return Promise.reject(UserError.UpdateUserFailed);
    }
  }

  /**
   * Delete a user by ID.
   */
  async deleteUser(userId: string): Promise<void> {
    try {
      const userRef = doc(this.db, this.collectionName, userId);
      await deleteDoc(userRef);
    } catch (error) {
      return Promise.reject(UserError.DeleteUserFailed);
    }
  }

  /**
   * Fetch a user by ID, email, or username.
   */
  async getUser(
    searchValue: string,
    searchType: keyof Pick<User, "id" | "email" | "username">,
  ): Promise<User | null> {
    const collectionRef = collection(this.db, this.collectionName);
    try {
      if (searchType === "id") {
        const userDoc = await getDoc(doc(collectionRef, searchValue));
        if (userDoc.exists()) {
          return { id: userDoc.id, ...userDoc.data() } as User;
        } else {
          return Promise.reject(UserError.UserNotFound);
        }
      } else {
        const q = query(collectionRef, where(searchType, "==", searchValue));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          return { id: userDoc.id, ...userDoc.data() } as User;
        } else {
          return Promise.reject(UserError.UserNotFound);
        }
      }
    } catch (error) {
      return Promise.reject(UserError.UserNotFound);
    }
  }

  /**
   * Log in a user with email and password.
   */
  async login(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password,
      );
      return userCredential;
    } catch (error) {
      return Promise.reject(UserError.LoginFailed);
    }
  }

  /**
   * Log out the current user.
   */
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      return Promise.reject(UserError.LogoutFailed);
    }
  }

  /**
   * Monitor authentication state changes.
   */
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void): void {
    onAuthStateChanged(this.auth, callback);
  }
}

export const usr = new UserStore();
