import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Heading = () => (
  <div className="max-w-3xl space-y-4">
    <h1 className="text-3xl font-bold sm:text-5xl md:text-6xl">
      Your Notes, Ideas, Docs & Plans. Unified. Welcome to{" "}
      <span className="underline">Jotion</span>
    </h1>
    <h3 className="text-base sm:text-lg md:text-xl">
      Jotion is the workspace where <br />
      better, faster work happens.
    </h3>
    <Button variant="default">
      Enter Jotion
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  </div>
);

export default Heading;
