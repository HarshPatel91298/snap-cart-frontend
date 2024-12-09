"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";


export default function PrelineScript() {
  const path = usePathname();

  console.log("PrelineScript", path);

  useEffect(() => {
    const loadPreline = async () => {
      await import("preline/preline");

      document.addEventListener('DOMContentLoaded', () => {
        if (window.HSStaticMethods && typeof window.HSStaticMethods.autoInit === 'function') {
          window.HSStaticMethods.autoInit();
        }
      });
    };

    loadPreline();
  }, [path]);

  return null;
}
