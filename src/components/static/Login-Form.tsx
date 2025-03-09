"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

const formSchema = z.object({
  email: z.string().email("Email tidak valid."),
  password: z.string().min(3, "Password harus minimal 3 karakter."),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await signIn("credentials", {
        ...data,
      });
    } catch (error) {
      form.setError("email", {
        type: "manual",
        message: "Email atau password salah.",
      });
      form.setError("password", {
        type: "manual",
        message: "Email atau password salah.",
      });
    }
  }

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center xl:h-auto xl:min-h-screen",
        className,
      )}
      {...props}
    >
      <Card className="w-full max-w-md p-6 xl:rounded-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Login</CardTitle>
          <CardDescription className="text-center text-base">
            Login untuk ke dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          htmlFor="email"
                          className="text-base"
                        >
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="m@example.com"
                            type="email"
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel
                            htmlFor="password"
                            className="text-base"
                          >
                            Password
                          </FormLabel>
                        </div>
                        <FormControl>
                          <div className="relative flex items-center">
                            <Input
                              type={showPassword ? "text" : "password"}
                              id="password"
                              required
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
                </div>
                <Button
                  type="submit"
                  className="w-full"
                >
                  Login
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
