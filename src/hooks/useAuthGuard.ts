/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "#store/hook";

export const useAuthGuard = () => {
  const router = useRouter();

  const isLoggedIn = useAppSelector((state) => state.app.isLoggedIn);
  const isRehydrated = useAppSelector(
    (state) => (state.app as any)?._persist?.rehydrated,
  );

  useEffect(() => {
    if (isRehydrated && !isLoggedIn) {
      router.replace("/auth/login");
    }
  }, [isRehydrated, isLoggedIn]);

  return { isAllowed: !!isLoggedIn };
};
