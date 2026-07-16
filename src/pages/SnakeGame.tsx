import { useEffect, useRef, useState, useCallback } from 'react';

// ========== 游戏配置 ==========

const GRID_SIZE = 20;          // 20×20 的网格
const CELL_SIZE = 18;          // 每格像素大小
const INITIAL_SPEED = 150;     // 初始速度（毫秒），数字越小越快
const SPEED_STEP = 5;          // 每吃一个食物加速多少毫秒
const MIN_SPEED = 60;          // 最快速度上限

// 方向对应的坐标变化
const DIRECTIONS: Record<string, { x: number; y: number }> = {
  ArrowUp:    { x: 0, y: -1 },
  ArrowDown:  { x: 0, y: 1 },
  ArrowLeft:  { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
  W: { x: 0, y: -1 },
  S: { x: 0, y: 1 },
  A: { x: -1, y: 0 },
  D: { x: 1, y: 0 },
};

// ========== 类型 ==========

interface Point {
  x: number;
  y: number;
}

// ========== 工具函数 ==========

/** 生成随机食物位置，不能和蛇身重叠 */
function randomFood(snake: Point[]): Point {
  const occupied = new Set(snake.map(p => `${p.x},${p.y}`));
  const maxAttempts = 1000; // 防止蛇太长时无限循环
  let attempts = 0;

  // 先随机尝试
  while (attempts < maxAttempts) {
    const point: Point = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (!occupied.has(`${point.x},${point.y}`)) {
      return point;
    }
    attempts++;
  }

  // 随机失败太多次 → 兜底：遍历整个网格，收集所有空格子再随机选
  const empty: Point[] = [];
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      if (!occupied.has(`${x},${y}`)) {
        empty.push({ x, y });
      }
    }
  }
  // 如果棋盘完全满了（理论上不应该发生），返回 (0,0) 作为最后兜底
  return empty.length > 0 ? empty[Math.floor(Math.random() * empty.length)] : { x: 0, y: 0 };
}

/** 初始蛇：中间偏左，长度 3 */
function initialSnake(): Point[] {
  const mid = Math.floor(GRID_SIZE / 2);
  return [
    { x: mid, y: mid },
    { x: mid - 1, y: mid },
    { x: mid - 2, y: mid },
  ];
}

// ========== 组件 ==========

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snakeRef = useRef<Point[]>(initialSnake());       // 蛇身
  const foodRef = useRef<Point>(randomFood(initialSnake())); // 食物
  const dirRef = useRef<{ x: number; y: number }>({ x: 1, y: 0 }); // 当前方向
  const nextDirRef = useRef<{ x: number; y: number }>({ x: 1, y: 0 }); // 缓冲方向（防止一帧内多次转向）
  const timerRef = useRef<number | null>(null);
  const gameOverTimerRef = useRef<number | null>(null);  // 追踪结束画面延迟绘制的 timeout
  const speedRef = useRef(INITIAL_SPEED);

  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [started, setStarted] = useState(false);

  // ========== 绘制函数 ==========

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = GRID_SIZE * CELL_SIZE;

    // 清空画布
    ctx.clearRect(0, 0, size, size);

    // 背景
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, size, size);

    // 画网格线（淡色）
    ctx.strokeStyle = '#16213e';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(size, i * CELL_SIZE);
      ctx.stroke();
    }

    // 画食物（闪烁的红点）
    const food = foodRef.current;
    ctx.fillStyle = '#ff6b6b';
    ctx.shadowColor = '#ff6b6b';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // 画蛇
    const snake = snakeRef.current;
    snake.forEach((seg, i) => {
      // 蛇头用亮绿色，蛇身渐变
      const t = snake.length > 1 ? i / (snake.length - 1) : 0;
      const r = Math.floor(78 + (1 - t) * 80);
      const g = Math.floor(207 + (1 - t) * 40);
      const b = Math.floor(101 + (1 - t) * 60);
      ctx.fillStyle = `rgb(${r},${g},${b})`;

      const x = seg.x * CELL_SIZE;
      const y = seg.y * CELL_SIZE;
      const pad = 1;

      if (i === 0) {
        // 蛇头：圆角矩形
        const radius = 4;
        ctx.beginPath();
        ctx.moveTo(x + radius + pad, y + pad);
        ctx.lineTo(x + CELL_SIZE - radius - pad, y + pad);
        ctx.quadraticCurveTo(x + CELL_SIZE - pad, y + pad, x + CELL_SIZE - pad, y + radius + pad);
        ctx.lineTo(x + CELL_SIZE - pad, y + CELL_SIZE - radius - pad);
        ctx.quadraticCurveTo(x + CELL_SIZE - pad, y + CELL_SIZE - pad, x + CELL_SIZE - radius - pad, y + CELL_SIZE - pad);
        ctx.lineTo(x + radius + pad, y + CELL_SIZE - pad);
        ctx.quadraticCurveTo(x + pad, y + CELL_SIZE - pad, x + pad, y + CELL_SIZE - radius - pad);
        ctx.lineTo(x + pad, y + radius + pad);
        ctx.quadraticCurveTo(x + pad, y + pad, x + radius + pad, y + pad);
        ctx.closePath();
        ctx.fill();

        // 蛇眼睛
        const dir = dirRef.current;
        ctx.fillStyle = '#fff';
        const eyeR = 2.5;
        let ex1: number, ey1: number, ex2: number, ey2: number;
        const cx = x + CELL_SIZE / 2;
        const cy = y + CELL_SIZE / 2;

        if (dir.x === 1) { // 向右
          ex1 = cx + 3; ey1 = cy - 3; ex2 = cx + 3; ey2 = cy + 3;
        } else if (dir.x === -1) { // 向左
          ex1 = cx - 3; ey1 = cy - 3; ex2 = cx - 3; ey2 = cy + 3;
        } else if (dir.y === -1) { // 向上
          ex1 = cx - 3; ey1 = cy - 3; ex2 = cx + 3; ey2 = cy - 3;
        } else { // 向下
          ex1 = cx - 3; ey1 = cy + 3; ex2 = cx + 3; ey2 = cy + 3;
        }

        ctx.beginPath();
        ctx.arc(ex1, ey1, eyeR, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(ex2, ey2, eyeR, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#111';
        ctx.beginPath();
        ctx.arc(ex1 + dir.x * 0.5, ey1 + dir.y * 0.5, 1.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(ex2 + dir.x * 0.5, ey2 + dir.y * 0.5, 1.2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // 蛇身：圆角矩形
        const radius = 3;
        ctx.beginPath();
        ctx.moveTo(x + radius + pad, y + pad);
        ctx.lineTo(x + CELL_SIZE - radius - pad, y + pad);
        ctx.quadraticCurveTo(x + CELL_SIZE - pad, y + pad, x + CELL_SIZE - pad, y + radius + pad);
        ctx.lineTo(x + CELL_SIZE - pad, y + CELL_SIZE - radius - pad);
        ctx.quadraticCurveTo(x + CELL_SIZE - pad, y + CELL_SIZE - pad, x + CELL_SIZE - radius - pad, y + CELL_SIZE - pad);
        ctx.lineTo(x + radius + pad, y + CELL_SIZE - pad);
        ctx.quadraticCurveTo(x + pad, y + CELL_SIZE - pad, x + pad, y + CELL_SIZE - radius - pad);
        ctx.lineTo(x + pad, y + radius + pad);
        ctx.quadraticCurveTo(x + pad, y + pad, x + radius + pad, y + pad);
        ctx.closePath();
        ctx.fill();
      }
    });

    // 如果暂停，画遮罩文字
    if (paused && !gameOver) {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⏸ 已暂停', size / 2, size / 2);
    }
  }, [paused, gameOver]);

  // ========== 游戏主循环 ==========

  const tick = useCallback(() => {
    const snake = snakeRef.current;
    const dir = dirRef.current;
    const nextDir = nextDirRef.current;

    // 应用缓冲方向（防止反向自杀）
    const head = snake[0];
    const isOpposite =
      nextDir.x === -dir.x && nextDir.y === -dir.y;
    const newDir = isOpposite ? dir : nextDir;
    dirRef.current = newDir;

    // 计算新蛇头位置
    const newHead: Point = {
      x: head.x + newDir.x,
      y: head.y + newDir.y,
    };

    // 撞墙检测
    if (
      newHead.x < 0 ||
      newHead.x >= GRID_SIZE ||
      newHead.y < 0 ||
      newHead.y >= GRID_SIZE
    ) {
      endGame();
      return;
    }

    // 撞自己检测（排除尾巴，因为尾巴马上要缩掉）
    const willGrow = newHead.x === foodRef.current.x && newHead.y === foodRef.current.y;
    const checkBody = willGrow ? snake : snake.slice(0, -1);
    if (checkBody.some(s => s.x === newHead.x && s.y === newHead.y)) {
      endGame();
      return;
    }

    // 移动蛇
    const newSnake = [newHead, ...snake];
    if (willGrow) {
      // 吃到食物：不缩尾巴，生成新食物
      foodRef.current = randomFood(newSnake);
      setScore(s => s + 1);
      // 加速
      speedRef.current = Math.max(MIN_SPEED, speedRef.current - SPEED_STEP);
    } else {
      newSnake.pop();
    }

    snakeRef.current = newSnake;
    draw();

    // 设置下一次 tick（用最新速度）
    timerRef.current = window.setTimeout(tick, speedRef.current);
  }, [draw]);

  // ========== 游戏结束 ==========

  function endGame() {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setGameOver(true);
    drawGameOver();
  }

  function drawGameOver() {
    // 清除上一次未执行的结束画面（防止多次调用叠加）
    if (gameOverTimerRef.current !== null) {
      clearTimeout(gameOverTimerRef.current);
    }
    gameOverTimerRef.current = window.setTimeout(() => {
      gameOverTimerRef.current = null;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const size = GRID_SIZE * CELL_SIZE;

      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, 0, size, size);

      ctx.fillStyle = '#ff6b6b';
      ctx.font = 'bold 26px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('游戏结束 💀', size / 2, size / 2 - 10);
    }, 50);
  }

  // ========== 开始 / 重新开始 ==========

  function startGame() {
    const snake = initialSnake();
    snakeRef.current = snake;
    foodRef.current = randomFood(snake);
    dirRef.current = { x: 1, y: 0 };
    nextDirRef.current = { x: 1, y: 0 };
    speedRef.current = INITIAL_SPEED;
    setScore(0);
    setGameOver(false);
    setPaused(false);
    setStarted(true);

    // 清空旧定时器（游戏循环 + 结束画面延迟绘制）
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
    if (gameOverTimerRef.current !== null) {
      clearTimeout(gameOverTimerRef.current);
      gameOverTimerRef.current = null;
    }

    draw();
    timerRef.current = window.setTimeout(tick, INITIAL_SPEED);
  }

  // ========== 暂停 / 继续 ==========

  function togglePause() {
    if (gameOver || !started) return;

    if (paused) {
      // 继续
      setPaused(false);
      timerRef.current = window.setTimeout(tick, speedRef.current);
    } else {
      // 暂停
      setPaused(true);
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      draw(); // 重绘，显示暂停遮罩
    }
  }

  // ========== 键盘事件 ==========

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const dir = DIRECTIONS[e.key];
      if (dir) {
        e.preventDefault();
        if (!started || gameOver) return;
        nextDirRef.current = dir;
        return;
      }

      // 空格暂停
      if (e.key === ' ') {
        e.preventDefault();
        togglePause();
      }

      // Enter 重新开始
      if (e.key === 'Enter' && gameOver) {
        startGame();
      }
    }

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [started, gameOver, paused]); // eslint-disable-line react-hooks/exhaustive-deps

  // ========== 触摸滑动支持 ==========

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  function handleTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (!touchStartRef.current || !started || gameOver) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    const minSwipe = 20; // 最小滑动距离（像素），过滤手指微动

    // 判断滑动方向（取绝对值大的方向）
    if (absDx > absDy && absDx >= minSwipe) {
      nextDirRef.current = dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
    } else if (absDy > absDx && absDy >= minSwipe) {
      nextDirRef.current = dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
    }
  }

  // ========== 清理 ==========

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
      if (gameOverTimerRef.current !== null) {
        clearTimeout(gameOverTimerRef.current);
      }
    };
  }, []);

  // ========== 初始化画布 ==========

  useEffect(() => {
    draw();
  }, [draw]);

  // ========== 渲染 ==========

  const canvasSize = GRID_SIZE * CELL_SIZE;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 标题与分数 */}
      <div className="flex items-center justify-between w-full max-w-[360px]">
        <h1 className="text-lg font-bold text-gray-800">🐍 贪吃蛇</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            得分：<span className="font-bold text-primary-600 text-base">{score}</span>
          </span>
        </div>
      </div>

      {/* 游戏画布 */}
      <div className="relative rounded-xl overflow-hidden shadow-lg border-2 border-gray-200">
        <canvas
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          className="block"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        />

        {/* 未开始时的遮罩 */}
        {!started && !gameOver && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3">
            <span className="text-4xl">🐍</span>
            <button
              onClick={startGame}
              className="px-6 py-2 bg-green-500 text-white rounded-full font-bold text-sm hover:bg-green-600 active:scale-95 transition-all"
            >
              开始游戏
            </button>
            <p className="text-white/60 text-xs">方向键 / WASD 控制</p>
          </div>
        )}

        {/* 结束时的遮罩 */}
        {gameOver && (
          <div className="absolute inset-0 bg-transparent flex flex-col items-center justify-end pb-6 gap-2">
            <button
              onClick={startGame}
              className="px-6 py-2 bg-green-500 text-white rounded-full font-bold text-sm hover:bg-green-600 active:scale-95 transition-all"
            >
              🔄 再来一局
            </button>
          </div>
        )}
      </div>

      {/* 操作提示 */}
      <div className="text-center text-xs text-gray-400 space-y-1">
        <p>⌨️ 方向键 / WASD 控制方向 · 空格键暂停</p>
        <p>📱 手机端滑动屏幕控制方向</p>
      </div>
    </div>
  );
}
