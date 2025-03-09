"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { logStore } from "@/lib/firebase/log_activity";
import { usr } from "@/lib/firebase/users";
import { zodResolver } from "@hookform/resolvers/zod";
import bcrypt from "bcryptjs";
import { Session, User } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { z } from "zod";

const schema = z
  .object({
    username: z.string(),
    email: z.string().email({ message: "Invalid email address" }),
    oldPassword: z.string().optional(),
    newPassword: z.string().optional(),
    isAdmin: z.enum(["true", "false"]),
  })
  .refine((data) => data.oldPassword === data.newPassword, {
    message: "Passwords do not match",
    path: ["newPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function GetUserAndEdit({
  targetUser,
  session,
}: {
  targetUser: User;
  session: Session;
}) {
  const s = useSession({ required: true });
  const userSession = session.user;

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [isOldPasswordValid, setIsOldPasswordValid] = useState(true);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: targetUser.username || "",
      email: targetUser.email || "",
      newPassword: "",
      oldPassword: "",
      isAdmin: targetUser.role === "Admin" ? "true" : "false",
    },
  });

  // Initialize state with default values
  const [hiddenElement, setHiddenElement] = useState({
    username: true,
    email: true,
    password: true,
    isAdmin: true,
  });

  useEffect(() => {
    if (userSession!.id === targetUser.id) {
      if (targetUser.priority === "System") {
        setHiddenElement({
          email: true,
          password: true,
          isAdmin: true,
          username: false,
        });
      } else {
        setHiddenElement({
          username: false,
          email: false,
          password: false,
          isAdmin: true,
        });
      }
    } else {
      if (userSession!.role === "Admin" && targetUser.role === "User") {
        setHiddenElement({
          username: false,
          email: false,
          password: false,
          isAdmin: false,
        });
      } else if (userSession!.role === "User" && targetUser.role === "Admin") {
        setHiddenElement({
          username: true,
          email: true,
          password: true,
          isAdmin: true,
        });
      } else if (userSession!.role === "Admin" && targetUser.role === "Admin") {
        setHiddenElement({
          username: false,
          email: false,
          password: false,
          isAdmin: false,
        });
      }

      if (
        userSession!.priority === "System" &&
        targetUser.priority === "Public"
      ) {
        setHiddenElement({
          username: false,
          email: false,
          password: false,
          isAdmin: false,
        });
      } else if (
        userSession!.priority === "Public" &&
        targetUser.priority === "System"
      ) {
        setHiddenElement({
          username: true,
          email: true,
          password: true,
          isAdmin: true,
        });
      }
    }
  }, [targetUser]);

  const validateOldPassword = async (oldPassword: string) => {
    try {
      const isValid = await bcrypt.compare(oldPassword, targetUser.password);
      setIsOldPasswordValid(isValid);
      if (!isValid) {
        toast({ title: "Error", description: "Old password is incorrect" });
      }
      return isValid;
    } catch (error) {
      toast({ title: "Error", description: "Failed to validate old password" });
      return false;
    }
  };

  const handleSubmitForm = async (formData: FormData) => {
    const { email, username, isAdmin, oldPassword, newPassword } = formData;

    const updatedData: Record<string, any> = {};

    let shouldUpdate = false;

    if (newPassword) {
      const isOldPasswordValid = await validateOldPassword(oldPassword || "");
      if (!isOldPasswordValid) return;

      updatedData.password = newPassword;
      shouldUpdate = true;
    }

    const admin = isAdmin === "true" ? "Admin" : "User";

    if (admin !== targetUser.role) {
      updatedData.role = admin;
    }

    const isOtherFieldsChanged = Object.keys(updatedData).some(
      (key) => updatedData[key] !== targetUser[key],
    );

    try {
      if (isOtherFieldsChanged || shouldUpdate) {
        await usr.updateUser(targetUser.id!, updatedData);

        toast({
          title: "Success",
          description: `User updated successfully ${targetUser.username} (${targetUser.id})`,
          className: "bg-green-600",
        });

        await logStore.logActivity({
          identity: userSession?.id,
          activity: `Memperbarui user ${targetUser?.username} (${targetUser.id})`,
          status: "update",
        });

        router.push("/dashboard/users");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update user",
      });
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Edit User</h1>
          <Separator className="my-4" />
        </div>

        <Card className="w-full shadow-md">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmitForm)}
              className="space-y-6 pt-6"
            >
              <CardContent className="space-y-6">
                {/* Username */}
                <FormField
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="username">Username</Label>
                      <FormControl>
                        <Input
                          disabled={hiddenElement.username}
                          id="username"
                          {...field}
                          placeholder="Enter username"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Email */}
                <FormField
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="email">Email</Label>
                      <FormControl>
                        <Input
                          id="email"
                          {...field}
                          type="email"
                          placeholder="Enter email"
                          disabled={hiddenElement.email}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Old Password */}
                <FormField
                  control={form.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="oldPassword">Old Password</Label>
                      <FormControl>
                        <div className="relative flex items-center">
                          <Input
                            id="oldPassword"
                            type={showPassword ? "text" : "password"}
                            {...field}
                            disabled={hiddenElement.password}
                          />
                          <Button
                            type="button"
                            variant={"link"}
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 p-2"
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage>
                        {!isOldPasswordValid && "Old password is incorrect"}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                {/* New Password */}
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="newPassword">New Password</Label>
                      <FormControl>
                        <div className="relative flex items-center">
                          <Input
                            id="newPassword"
                            type={showPassword ? "text" : "password"}
                            {...field}
                            disabled={
                              hiddenElement.password ||
                              !form.getValues("oldPassword")
                            }
                          />
                          <Button
                            type="button"
                            variant={"link"}
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 p-2"
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Is Admin */}
                <FormField
                  name="isAdmin"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Is Admin?</Label>
                      <FormControl>
                        <Select
                          {...field}
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={hiddenElement.isAdmin}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Yes</SelectItem>
                            <SelectItem value="false">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>

              <CardFooter className="flex justify-end">
                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                >
                  Save Changes
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
