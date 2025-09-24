import { Outlet } from 'react-router-dom';
import { AdminHeader } from '.';
import { Menu } from '../General';
import { menuItems } from '@data/menuItems';
import { SetStateAction, useCallback,  useState } from 'react';
import { IoChevronForwardCircleOutline, IoChevronBackCircleOutline } from "react-icons/io5";
import {CustomTooltip} from '../General';

export const DashboardLayout = () => {
  const [collapse, setCollapse] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // const { getAuthPayload, getAuthPayloadData } = useAuth();

  const handleSetTooltipContent = useCallback(
    (content: SetStateAction<string>, event: { clientX: any; clientY: any }) => {
      setTooltipContent(content);
      setShowTooltip(true);
      setTooltipPosition({ x: event.clientX, y: event.clientY });
    },
    []
  );

  const handleHideTooltip = useCallback(() => {
    setShowTooltip(false);
  }, []);

  const toggleSidebar = () => {
    setCollapse(!collapse);
  };

  // useEffect(() => {
  //   getAuthPayload();
  // }, []);

  // useEffect(() => {
  //   // This will run whenever getAuthPayloadData changes

  //   if (getAuthPayloadData?.data?.payload) {
  //     const { admin_permissions, role_type } = getAuthPayloadData.data.payload;

  //     if (role_type !== 'SADM') {
  //       // Filter for regular users
  //       const newMenuItem = menuItems.filter((menuItem) => {
  //         if (menuItem?.title === 'Dashboard' || menuItem?.title === 'Settings')
  //           return menuItem?.title;
  //         return (
  //           admin_permissions &&
  //           admin_permissions[menuItem?.title?.toLowerCase()] &&
  //           admin_permissions[menuItem.title.toLowerCase()].includes('read')
  //         );
  //       });
  //       setUpdatedItems(newMenuItem);
  //     } else {
  //       // For super admins show all items
  //       setUpdatedItems(menuItems);
  //     }
  //   }
  // }, [getAuthPayloadData]);

  return (
    <section
      className={`grid ${
        collapse ? 'grid-cols-[80px_1fr]' : 'grid-cols-[236px_1fr]'
      }  h-[100vh]  transition-all duration-300`}
    >
      <section className="h-full relative">
        <div
          className="flex items-center justify-center h-10 w-10 absolute z-50 -right-5 top-20 cursor-pointer rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow"
          onClick={toggleSidebar}
        >
          <p>{collapse ? <IoChevronForwardCircleOutline /> : <IoChevronBackCircleOutline />}</p>
          
        </div>
        <Menu
          items={menuItems}
          collapse={collapse}
          setTooltipContent={handleSetTooltipContent}
          hideTooltip={handleHideTooltip}
        />
      </section>
      <main className="flex flex-col max-h-[100vh] overflow-auto">
        <AdminHeader />
        <Outlet />
      </main>
      {showTooltip && <CustomTooltip content={tooltipContent} position={tooltipPosition} />}
    </section>
  );
};
