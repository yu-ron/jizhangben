import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Records from './pages/Records';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import SnakeGame from './pages/SnakeGame';

/** 应用根组件——配置路由：首页、账单、统计、设置、贪吃蛇 5 个页面（Hook 验证测试） */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="records" element={<Records />} />
        <Route path="statistics" element={<Statistics />} />
        <Route path="settings" element={<Settings />} />
        <Route path="snake" element={<SnakeGame />} />
      </Route>
    </Routes>
  );
}
