import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-xl font-semibold">Dashboard</h2>
        </div>
        <nav className="mt-6">
          {['Dashboard', 'Projects', 'Tasks', 'Calendar', 'Reports'].map((item, index) => (
            <a key={index} href="#" className="block py-2 px-4 text-gray-600 hover:bg-gray-100">
              {item}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <button className="text-gray-500 focus:outline-none">
              <Menu size={24} />
            </button>
            <div className="flex items-center">
              <div className="relative mr-4">
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-gray-100 text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2 text-gray-400" size={18} />
              </div>
              <button className="text-gray-500 focus:outline-none mr-4">
                <Bell size={24} />
              </button>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Main content area */}
            <div className="col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Main Content</h3>
                <p className="text-gray-600">Your primary content goes here.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Secondary Content</h3>
                <p className="text-gray-600">Additional information or data visualization.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Tertiary Content</h3>
                <p className="text-gray-600">More content or features can be added here.</p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-blue-500 hover:underline">Create New Project</a></li>
                  <li><a href="#" className="text-blue-500 hover:underline">Add Task</a></li>
                  <li><a href="#" className="text-blue-500 hover:underline">Generate Report</a></li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <p className="text-gray-600">Display recent user activities or notifications here.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;