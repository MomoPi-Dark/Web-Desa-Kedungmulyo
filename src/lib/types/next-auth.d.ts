import "next-auth";

declare module "next-auth" {
  interface User {
    id: string; // Include id if needed
    role: "Admin" | "User"; // Optional role of the user
    email: string; // User's email
    username: string; // Optional username
    priority: "System" | "Public";
    [key: string]: any; // Additional custom user fields
  }

  interface Session {
    user: Required<User>;
    expires: string;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends User {
    accessToken: string;
    [key: string]: any;
  }
}
