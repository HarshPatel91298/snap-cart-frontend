"use client";
import PrelineScript from "../../../components/PrelineScript";
import dynamic from "next/dynamic";

const NextTopLoader = dynamic(() => import('nextjs-toploader'), { ssr: false });

export default function AdminLayout({ children }) {
  console.log(children);

  return (
    <div>
        {children}
      <PrelineScript />
      <NextTopLoader />
    </div>
  );
}
