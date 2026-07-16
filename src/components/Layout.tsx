import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/', label: '首页', icon: '🏠' },
  { to: '/records', label: '账单', icon: '📋' },
  { to: '/statistics', label: '统计', icon: '📊' },
  { to: '/settings', label: '设置', icon: '⚙️' },
  { to: '/snake', label: '贪吃蛇', icon: '🐍' },
];

export default function Layout() {
  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <main className="px-4 pt-4">
        <Outlet />
      </main>

      {/* 底部导航栏 */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white border-t border-gray-200 safe-area-bottom">
        <div className="flex justify-around items-center h-16">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                  isActive ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
