"use client";
import useCurrentUser from "@/queries/auth/useCurrentUser";
import { useRouter } from "next/navigation";
import FullScreenLoading from "@/components/common/full-screen-loading";

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useCurrentUser();

  if (user) {
    router.replace("/dashboard");
  }

  if (!isLoading && !user) {
    router.replace("/login");
  }

  return <FullScreenLoading />;
}
