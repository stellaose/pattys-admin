"use client";
import { AppLayouts } from "#components/layouts";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoArrowLeft } from "react-icons/go";
import { motion } from "framer-motion";
import { Stagger, fadeUp } from "#components/general";
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
      <Stagger className={notFoundBody} stagger={0.1}>
        <motion.p
          className={notFoundCode}
          variants={{
            hidden: { opacity: 0, scale: 0.6, rotate: -8 },
            show: {
              opacity: 1,
              scale: 1,
              rotate: 0,
              transition: { type: "spring", stiffness: 220, damping: 14 },
            },
          }}
        >
          404
        </motion.p>
        <motion.p variants={fadeUp} className={eyebrow}>
          page not found
        </motion.p>
        <motion.h1 variants={fadeUp} className={sectionTitle}>
          You made a wrong turn<span className="text-purple-200">.</span>
        </motion.h1>
        <motion.p variants={fadeUp} className={`${sectionText} max-w-[420px]`}>
          The page you are looking for does not exist or has been moved.
        </motion.p>
        <motion.div
          variants={fadeUp}
          className="flex flex-wrap justify-center gap-4 mt-4"
        >
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
        </motion.div>
      </Stagger>
    </AppLayouts>
  );
};

export default NotFound;
