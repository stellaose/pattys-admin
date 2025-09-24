import { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { MenuProps } from "@models/application/props";
import { MdLogout } from "react-icons/md";
import SidebarLogo from "@assets/logo/small-logo.jpg";
import Logo from "@assets/logo/logo.png";

export const Menu: React.FC<MenuProps> = ({
  items,
  collapse,
  setTooltipContent,
  hideTooltip,
}) => {
  const [menu, setMenu] = useState(items);
  const setIsActive = useCallback(
    (key: string) => {
      const currentUrl = window.location.href;
      const newMenu = menu.map((item: object | any) => {
        const isActive = currentUrl.includes(item.url);
        if (item.key === key) {
          return { ...item, active: isActive };
        } else {
          return { ...item, active: false };
        }
      });
      setMenu(newMenu);
    },
    [menu]
  );

  useEffect(() => {
    setMenu(items);
  }, [items]);

  return (
    <aside className="bg-primary px-3 flex flex-col pt-[50px] pb-[30px] h-full justify-between">
      <div>
        <div className="mb-7 flex items-center justify-center">
          <motion.div
            initial="hidden"
            transition={{ duration: 0.7, delay: 0.3 }}
            animate="visible"
            variants={{ visible: { opacity: 1 }, hidden: { opacity: 0 } }}
          >
            <img
              className={`${!collapse ? "w-[150px]" : "w-[40px]"}`}
              src={collapse ? SidebarLogo : Logo}
              alt={collapse ? "collapse" : "expand"}
            />
          </motion.div>
        </div>
        {menu.map((item: object | any) => (
          <motion.li
            key={item.key}
            className="p-[8px] text-black-100 h-15 flex items-center "
            onMouseEnter={(e) => collapse && setTooltipContent(item.title, e)}
            onMouseLeave={hideTooltip}
            onClick={() => setIsActive(item.key)}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <NavLink
              to={item.url}
              className={({ isActive }) => {
                return `${
                  isActive && "bg-primary-100 font-medium"
                } h-full w-full rounded-[4px] py-2 px-3 flex items-center gap-2 text-sm font-medium hover:bg-primary-100`;
              }}
            >
              {item.icon}
              {!collapse && <span>{item.title}</span>}
            </NavLink>
          </motion.li>
        ))}
      </div>
      <div
        className="m-[8px] ml-[25px] p-[8px] flex items-center gap-5 text-base font-semibold text-black-100 cursor-pointer"
        onClick={() => {
          window.location.href = "/";
          localStorage.clear();
        }}
        onMouseEnter={(e) => collapse && setTooltipContent("Log out", e)}
        onMouseLeave={hideTooltip}
      >
        <MdLogout fontSize={20}/>
        {!collapse && <p>Log out</p>}
      </div>
    </aside>
  );
};
