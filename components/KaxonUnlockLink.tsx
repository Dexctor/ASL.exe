"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FINAL_PERCENT } from "@/data/quiz";

const readHumanity = () => {
  if (typeof window === "undefined") {
    return 0;
  }
  const stored = window.sessionStorage.getItem("asl_humanity");
  const value = stored ? Number.parseFloat(stored) : 0;
  return Number.isFinite(value) ? value : 0;
};

export default function KaxonUnlockLink() {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const handle = () => {
      setPercent(readHumanity());
    };
    handle();
    window.addEventListener("storage", handle);
    window.addEventListener("asl:unlock", handle);
    return () => {
      window.removeEventListener("storage", handle);
      window.removeEventListener("asl:unlock", handle);
    };
  }, []);

  if (percent < FINAL_PERCENT) {
    return null;
  }


}
