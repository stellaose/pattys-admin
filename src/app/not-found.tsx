"use client";
import { AppLayouts } from "#components/layouts";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoArrowLeft } from "react-icons/go";
import { useAppSelector } from "#store/hook";
import {
  eyebrow,
  notFoundBody,
  notFoundCode,
  outlineLink,
  primaryLink,
  sectionText,
  sectionTitle,
} from "#/styles/home";

const NotFound = () => {
  const router = useRouter();
  const isLoggedIn = useAppSelector((state) => state.app.isLoggedIn);

  return (
    <AppLayouts>
      <div className={notFoundBody}>
        <p className={notFoundCode}>404</p>
        <p className={eyebrow}>page not found</p>
        <h1 className={sectionTitle}>
          You made a wrong turn<span className="text-purple-200">.</span>
        </h1>
        <p className={`${sectionText} max-w-[420px]`}>
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <Link href={isLoggedIn ? "/dashboard" : "/"}>
            <span className={primaryLink}>
              {isLoggedIn ? "Back to dashboard" : "Back to home"}
            </span>
          </Link>
          <button
            type="button"
            className={`${outlineLink} cursor-pointer`}
            onClick={() => router.back()}
          >
            <GoArrowLeft size={16} /> Go back
          </button>
        </div>
      </div>
    </AppLayouts>
  );
};

export default NotFound;
