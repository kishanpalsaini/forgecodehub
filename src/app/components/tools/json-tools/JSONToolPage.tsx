import { Suspense } from "react";
import Navbar from "@/app/components/Navbar";
import JSONToolsHub from "./JSONToolsHub";

export default function JSONToolPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <JSONToolsHub />
      </Suspense>
    </>
  );
} 