"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectToSignin() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/signin");
    }, 1500); // Laisse le temps de voir le loader

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-white dark:bg-gray-900">
      <div className="flex flex-col items-center">
        <div className="loader"></div>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          Redirection vers la page de connexion...
        </p>
      </div>

      <style jsx>{`
        .loader {
          border: 4px solid #e5e7eb;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
