"use client";
import React, { ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { LuShieldCheck, LuFileText, LuUsers } from "react-icons/lu";
import { Logo } from "#assets/images";
import { AdminHero } from "#assets/svg";
import { Float, Stagger, StaggerItem, fadeUp } from "#components/general";
import {
  authBadge,
  authFeature,
  authFeatureIcon,
  authFeatureText,
  authFeatureTitle,
  authForm,
  authFormBody,
  authFormHeadline,
  authFormSubheading,
  authFormTitle,
  authHeroText,
  authHeroTitle,
  authLayoutMainBody,
} from "#/styles/auth";

const features = [
  {
    icon: <LuFileText size={28} className="text-purple-200" />,
    title: "Content",
    text: "Review and publish stories",
  },
  {
    icon: <LuUsers size={28} className="text-purple-200" />,
    title: "Community",
    text: "Manage writers and readers",
  },
  {
    icon: <LuShieldCheck size={28} className="text-purple-200" />,
    title: "Moderation",
    text: "Keep conversations healthy",
  },
];

export const AuthLayout: React.FC<{
  children: ReactNode;
  title?: string;
  headline?: string;
  description?: string;
}> = ({ children, title, headline, description }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.35, ease: [0.26, 1, 0.4, 1] }}
      className={authLayoutMainBody}
    >
      <Image src={Logo} alt="Pattys" className="w-[165px] pt-6.5" loading="eager" />

      <div className="flex">
        <div className="w-[50vw] overflow-hidden max-2lg:hidden block pt-16 pb-4">
          <Stagger delay={0.6} className="max-w-[420px] flex flex-col gap-4">
            <motion.span variants={fadeUp} className={authBadge}>
              <LuShieldCheck size={14} /> Admin console
            </motion.span>
            <motion.h1 variants={fadeUp} className={authHeroTitle}>
              Run the <span className="text-purple-200">community.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className={authHeroText}>
              Everything you need to keep Pattys thoughtful, safe and growing —
              all in one place.
            </motion.p>
          </Stagger>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.85, ease: [0.26, 1, 0.4, 1] }}
          >
            <Float>
              <Image
                src={AdminHero}
                alt=""
                loading="eager"
                className="mt-6 w-full max-w-[380px] xxl:max-w-[460px] h-auto"
              />
            </Float>
          </motion.div>

          <Stagger
            delay={1.05}
            stagger={0.12}
            className="flex max-w-[560px] justify-between gap-6 mt-8"
          >
            {features.map((feature) => (
              <StaggerItem key={feature.title} className={authFeature}>
                <motion.div
                  className={authFeatureIcon}
                  whileHover={{ y: -4, rotate: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  {feature.icon}
                </motion.div>
                <div className="flex flex-col gap-1">
                  <p className={authFeatureTitle}>{feature.title}</p>
                  <p className={authFeatureText}>{feature.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <div className={authForm}>
          <motion.div
            className="overflow-auto h-9/10"
            initial={shouldReduceMotion ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.55,
              delay: shouldReduceMotion ? 0 : 0.25,
              ease: [0.26, 1, 0.4, 1],
            }}
          >
            <div className={authFormBody}>
              <Stagger delay={0.45}>
                {(title || headline || description) && (
                  <div className="mb-8 mt-14">
                    {title && (
                      <motion.p variants={fadeUp} className={authFormTitle}>
                        {title}
                      </motion.p>
                    )}
                    {headline && (
                      <motion.h3 variants={fadeUp} className={authFormHeadline}>
                        {headline}
                      </motion.h3>
                    )}
                    {description && (
                      <motion.p
                        variants={fadeUp}
                        className={authFormSubheading}
                      >
                        {description}
                      </motion.p>
                    )}
                  </div>
                )}
                <StaggerItem>{children}</StaggerItem>
              </Stagger>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
