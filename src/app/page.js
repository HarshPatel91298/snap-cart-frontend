"use client";
import { UserAuth } from "@/context/AuthContext";

export default function Home() {

  const { user } = UserAuth();

  console.log("User: ", user);

  return (
    <div className="flex items-center justify-center min-h-screen">
      Welcome,
      {user ? user.displayName : "Not logged in"}
     </div>
  );
}
