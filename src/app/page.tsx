import { authOptions } from "@/lib/auth";
import Login from "@/components/Login";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);
  console.log({ session });

  // if (session) {
  //   redirect("/emails");
  // }
  return (
    <>
      <Login />
    </>
  );
}
