import { Overview } from "#components/elements";
import { RecentActivity } from "#components/elements/dashboard/RecentActivity";

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-6">
      <Overview />
      <RecentActivity />
    </div>
  );
};

export default Dashboard;
