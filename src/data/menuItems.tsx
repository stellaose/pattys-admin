import {
  MdPeopleAlt,
  MdOutlineDashboard,
  MdOutlineAdminPanelSettings,
} from "react-icons/md";
import { AiOutlineProduct } from "react-icons/ai";
import {
  IoReceiptOutline,
  IoAnalyticsOutline,
  IoSettingsOutline,
} from "react-icons/io5";

export const menuItems = [
  {
    title: "Dashboard",
    key: "1",
    active: true,
    url: "/admin/dashboard",
    icon: <MdOutlineDashboard  fontSize={20}/>,
  },
  {
    title: "Customers",
    key: "2",
    active: false,
    url: "/admin/customers",
    icon: <MdPeopleAlt fontSize={20}/>,
  },
  {
    title: "Administrators",
    key: "3",
    active: false,
    url: "/admin/administrators",
    icon: <MdOutlineAdminPanelSettings fontSize={20}/>,
  },
  {
    title: "Products",
    key: "4",
    active: false,
    url: "/admin/products",
    icon: <AiOutlineProduct fontSize={20}/>,
  },
  {
    key: "5",
    title: "Order",
    active: false,
    url: "/admin/orders",
    icon: <IoReceiptOutline fontSize={20}/>,
  },
  {
    title: "Reports",
    key: "6",
    active: false,
    url: "/admin/reports",
    icon: <IoAnalyticsOutline fontSize={20}/>,
  },
  {
    title: "Settings",
    key: "7",
    active: false,
    url: "/admin/settings",
    icon: <IoSettingsOutline fontSize={20}/>,
  },
];
