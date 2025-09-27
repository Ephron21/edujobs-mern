import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: 'dashboard' },
  { name: 'Announcements', href: '/admin/announcements', icon: 'announcement' },
  { name: 'Users', href: '/admin/users', icon: 'people' },
  { name: 'Settings', href: '/admin/settings', icon: 'settings' },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-indigo-700">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-white text-2xl font-bold">Admin Panel</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      isActive
                        ? 'bg-indigo-800 text-white'
                        : 'text-indigo-100 hover:bg-indigo-600',
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                    )}
                  >
                    <span className="mr-3">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
            <div className="flex items-center">
              <div>
                <div className="text-base font-medium text-white">
                  {user?.username}
                </div>
                <div className="text-sm font-medium text-indigo-200">
                  {user?.role}
                </div>
              </div>
              <div className="ml-auto">
                <button
                  onClick={logout}
                  className="text-sm text-indigo-200 hover:text-white"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="bg-white shadow-sm">
          <div className="px-4 py-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              {navigation.find((nav) => nav.href === location.pathname)?.name || 'Dashboard'}
            </h1>
          </div>
        </div>
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="py-4">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
