import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Workspace from "./workspace-client";

export const dynamic = "force-dynamic";

export default async function WorkspacePage() {
  const user = await currentUser();
  if (!user) redirect("/login");
  const account = {
    id: user.id,
    name: user.fullName || user.firstName || "Researcher",
    email: user.primaryEmailAddress?.emailAddress || "",
    initials: `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}` || "R",
    imageUrl: user.imageUrl,
  };

  return <Workspace account={account} />;
}
