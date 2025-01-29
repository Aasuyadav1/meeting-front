import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="flex">
      <div className="w-64 h-screen bg-gray-800 text-white p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-4">Dashboard</h2>
        <nav className="space-y-2">
          <Link to="/meeting" className="block p-2 hover:bg-gray-700 rounded">
            Meetings
          </Link>
          <Link to="/calendar" className="block p-2 hover:bg-gray-700 rounded">
            Calendar
          </Link>
        </nav>
      </div>
      <div className="flex-1 w-full p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
