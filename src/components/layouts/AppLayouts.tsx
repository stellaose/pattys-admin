import React, { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const AppLayouts: FC<Props> = ({ children }) => {
  return <div>{children}</div>;
};
