import { Button } from "@/components/ui/button";
import { Link } from "next-view-transitions";

// TODO: Login Page
export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between p-24 gap-8">
      <h1>hello frens</h1>
      <Link href="/dashboard">
        <Button>Dashboard</Button>
      </Link>
    </main>
  );
}
