"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Loader as ImgLoader } from "#assets/svg";

export const Loader = () => {
  return (
    <>
      <div className="h-[100vh] w-[100vw] flex flex-col justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Image src={ImgLoader} alt="" className="m-auto" loading="eager" />
          <motion.p
            className="text-lg font-semibold text-center"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity }}
          >
            Loading
          </motion.p>
        </motion.div>
      </div>
    </>
  );
};
