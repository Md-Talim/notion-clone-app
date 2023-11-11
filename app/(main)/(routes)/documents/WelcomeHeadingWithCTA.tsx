"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { PlusCircle } from "lucide-react";

const WelcomeHeadingWithCTA = () => {
  const { user } = useUser();
  const usersFullName = user?.fullName;

  return (
    <>
      <h2>Welcome to {usersFullName}&apos;s Jotion.</h2>
      <Button>
        <PlusCircle className="mr-2 h-4 w-4" />
        Create a note
      </Button>
    </>
  );
};

export default WelcomeHeadingWithCTA;
