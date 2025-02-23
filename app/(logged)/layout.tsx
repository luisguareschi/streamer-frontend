"use client";
import { Navbar } from "@/components/common/navbar";
import useCurrentUser from "@/queries/auth/useCurrentUser";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isFetching } = useCurrentUser();

  if (!isFetching && !user) {
    router.replace("/login");
  }

  return (
    <div>
      {children}
      <Navbar />
    </div>
  );
}
