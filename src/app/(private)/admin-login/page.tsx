import { LoginForm } from "@/components/static/Login-Form";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <LoginForm />
    </div>
  );
}
