import { useState } from "react";
import { NavLink } from "react-router-dom";

export interface CustomMenuProps {
  title: string;
  url: string;
  icon: React.ReactNode;
}

export const MenuItem: React.FC<CustomMenuProps> = ({ icon, title, url }) => {
  const [isActive, setIsActive] = useState(false);
  return (
    <li className="p-[8px] text-white h-16 flex items-center gap-2">
      {isActive && <div className="bg-purple-400 w-2 rounded-3xl h-full" />}
      <NavLink
        to={url}
        onClick={() => setIsActive(!isActive)}
        className={`${
          isActive && "bg-purple-400"
        } h-full w-full rounded-[4px] p-[8px] flex items-center gap-5 text-base font-medium`}
      >
        {icon}
        <span>{title}</span>
      </NavLink>
    </li>
  );
};
