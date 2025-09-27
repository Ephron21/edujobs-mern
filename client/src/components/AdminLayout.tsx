import { NavLink, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="flex">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
        <nav>
          <ul>
            <li>
              <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'text-blue-400' : ''}>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/announcements" className={({ isActive }) => isActive ? 'text-blue-400' : ''}>
                Announcements
              </NavLink>
            </li>
            {/* Add more links as we build more sections */}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
