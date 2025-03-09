"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { UserError, usr } from "@/lib/firebase/users";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const schema = z
  .object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    isAdmin: z.enum(["true", "false"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

const AddUserPage = () => {
  const route = useRouter();

  const session = useSession({ required: true });
  const userSession = session.data?.user;

  const [showPassword, setShowPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (userSession?.role === "Admin") {
      setIsAdmin(true);
    }
  }, [userSession]);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      isAdmin: "false",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await usr.createUser({
        email: data.email,
        username: data.username,
        password: data.password,
        role: data.isAdmin === "true" ? "Admin" : "User",
        priority: "Public",
      });

      toast({
        title: "Success",
        className: "bg-green-600",
        description: "User created successfully",
      });

      await logStore.logActivity({
        identity: userSession?.id,
        activity: `Membuat user ${data.username}`,
        status: "create",
      });

      route.push("/dashboard/users");
    } catch (err: any) {
      if (err === UserError.UserAlreadyExists) {
        form.setError("email", {
          type: "validate",
          message: "Email Already Exists",
        });
      } else if (err === UserError.CreateUserFailed) {
        console.error(err);
        toast({
          title: "Error",
          description: "Error create user",
          className: "bg-red-600",
        });
      }
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Buat User</h1>
          <Separator className="my-4" />
        </div>
        <Card className="w-full shadow-md">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 pt-6"
            >
              <CardContent className="space-y-4">
                {/* Username */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="username">Username</Label>
                      <FormControl>
                        <Input
                          id="username"
                          placeholder="Enter username"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="email">Email</Label>
                      <FormControl>
                        <Input
                          id="email"
                          placeholder="Enter email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="password">Password</Label>
                      <FormControl>
                        <div className="relative flex items-center">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            {...field}
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

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <FormControl>
                        <div className="relative flex items-center">
                          <Input
                            id="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm password"
                            {...field}
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
                {isAdmin && (
                  <FormField
                    control={form.control}
                    name="isAdmin"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Is Admin?</Label>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
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
                )}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                >
                  Submit
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default AddUserPage;
