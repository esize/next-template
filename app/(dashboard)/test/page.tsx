import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function TestPage() {
  return (
    <div>
      <h1>Test Page</h1>
      <Button asChild variant={"default"}>
        <Link href="">Log Back In</Link>
      </Button>
    </div>
  );
}
