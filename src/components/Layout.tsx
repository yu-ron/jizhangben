import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/', label: '首页', icon: '🏠' },
  { to: '/records', label: '账单', icon: '📋' },
  { to: '/statistics', label: '统计', icon: '📊' },
  { to: '/settings', label: '设置', icon: '⚙️' },
  { to: '/snake', label: '贪吃蛇', icon: '🐍' },
];

/**
 * 应用主布局——顶部导航栏 + 内容区（传统网站风格）
 */
export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-6">
          {/* Logo */}
          <NavLink to="/" className="text-lg font-bold text-gray-800 flex items-center gap-2">
            📒 记账本
          </NavLink>

          {/* 导航链接 */}
          <div className="flex items-center gap-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* 内容区 */}
      <main className="max-w-6xl mx-auto px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
