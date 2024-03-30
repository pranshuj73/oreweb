"use client"

import CustomError from "@/components/CustomError"
import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter();

  const reset = () => {
    router.push("/");
  }

  return (
    <CustomError reset={reset} />
  )
}