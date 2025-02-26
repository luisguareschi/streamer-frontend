"use client";
import { Button } from "@/components/ui/button";
import useLogout from "@/queries/auth/useLogout";
import useCurrentUser from "@/queries/auth/useCurrentUser";
import { UserRound } from "lucide-react";

const ProfilePage = () => {
  const { logout } = useLogout();
  const { user } = useCurrentUser();
  return (
    <div className="flex flex-col gap-4 p-4 w-full h-full pb-28 overflow-y-auto no-scrollbar">
      <h1 className="text-2xl font-medium text-white mb-20">
        Profile Settings
      </h1>
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center justify-center p-8 bg-neutral-500 rounded-full aspect-square w-fit text-neutral-800">
          <UserRound className="size-12" />
        </div>
        <div className="flex flex-col justify-center items-center">
          <p className="text-white text-lg">{user?.username}</p>
          <p className="text-neutral-400 text-lg">{user?.email}</p>
        </div>
      </div>
      <Button
        variant="roundedWhite"
        onClick={() => logout()}
        size="xl"
        className="mt-auto"
      >
        Logout
      </Button>
    </div>
  );
};

export default ProfilePage;
