import { Experience } from "@/components/Experience";
import { ThemeToggle } from "@/components/ThemeToggle";
import dynamic from "next/dynamic";


export default function Home() {
  return  (
    <>
      <Experience />
      <ThemeToggle />

    </>
  )
}
