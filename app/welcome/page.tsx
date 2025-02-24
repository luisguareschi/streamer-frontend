/* eslint-disable @next/next/no-img-element */
import { AppIcon } from "@/components/icons/app-icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const WelcomePage = () => {
  return (
    <div className="flex flex-col items-center justify-end h-screen text-white p-4 gap-4 md:justify-center">
      <img
        src="https://preview.redd.it/2jhtmqhg4mo81.png?width=1920&format=png&auto=webp&s=0d41709c3c478d2bcadfd8f2450271f175c0676f"
        alt="Streamer Logo"
        className="absolute -top-20 left-0 w-full h-full object-cover z-0"
      />
      <div className="absolute bottom-0 left-0 w-full h-[70vh] bg-gradient-to-t from-black via-black to-transparent z-0" />
      <div className="flex flex-col items-center justify-center gap-4 relative z-10 w-full md:w-fit">
        <AppIcon className=" mb-10" />
        <h1 className="text-center text-2xl font-bold mb-4 ">
          Start Watching Movies and TV Shows on Streamer
        </h1>
        <p className="text-center text-neutral-400 font-light mb-4 ">
          Watch unlimited movies and TV shows on Streamer. Completely for free.
        </p>
        <Link href="/login" className="w-full ">
          <Button variant="roundedWhite" className="w-full " size="xl">
            LOGIN
          </Button>
        </Link>
        <Link href="/login?signup=true" className="w-full ">
          <Button variant="roundedBorder" className="w-full " size="xl">
            CREATE ACCOUNT
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default WelcomePage;
