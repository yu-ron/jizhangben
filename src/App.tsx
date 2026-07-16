import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Records from './pages/Records';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import SnakeGame from './pages/SnakeGame';

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
