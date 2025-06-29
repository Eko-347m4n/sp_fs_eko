"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    // Redirect to /login page
    router.replace("/login");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-center text-red-600">
        {error ? `Sign in error: ${error}` : "Redirecting to login..."}
      </p>
    </div>
  );
}
