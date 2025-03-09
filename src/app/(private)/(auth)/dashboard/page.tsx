import { redirect } from "next/navigation";

export default async function Dashboard() {
  return redirect("dashboard/data-penduduk");
}
