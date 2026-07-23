# 📋 代码质量综合报告

**时间**：2026-07-23
**项目**：jizhangben（记账本）

---

## 📊 质量总览

| 维度 | 评分 | 问题数 |
|------|------|--------|
| 注释完整度 | ⭐⭐ | 28 |
| 安全性 | ⭐⭐⭐⭐⭐ | 0（项目内） |
| 代码复杂度 | ⭐⭐⭐ | 4 |
| 命名规范 | ⭐⭐⭐⭐ | 8 |
| TypeScript 类型 | ⭐⭐⭐⭐ | 1 |
| 未使用代码 | ⭐⭐⭐⭐ | 1 |

**综合评分**：3.5 / 5

> 说明：项目源码整体结构清晰、类型安全、无高危漏洞。主要扣分项集中在注释缺失（28 处函数未写注释），以及 SnakeGame.tsx 中个别函数过长。修复成本低，收益明显。

---

## 各维度详情

### 1. 注释完整度 ⭐⭐ — 28 个问题

> 详见自动生成的 `comment-report.md`（项目根目录）。

**核心发现**：
- 42 个函数/逻辑块中，22 个完全无注释（52%），6 个注释过于笼统。
- 重灾区是 `src/utils/storage.ts`（10 个 CRUD 函数全无注释）和 `src/store/AppContext.tsx`（状态管理中心无函数级注释）。
- GitHub Copilot / Claude 等 AI 编码助手在缺乏注释时，无法准确理解上下文，会生成偏离意图的代码。

**建议**：优先给 `storage.ts` 的导出函数补上 JSDoc，因为它们是整个应用的数据基础层。

---

### 2. 安全性 ⭐⭐⭐⭐⭐ — 0 个问题（项目内）

> 详见自动生成的 `security-report.md`（项目根目录）。

**核心发现**：
- 项目源码中无硬编码密钥、无 SQL/命令注入风险、无 XSS（未使用 `dangerouslySetInnerHTML`）、无 `console.log` 泄露敏感数据。
- 安全报告中发现 1 条 🔴 严重问题，但位于 `~/.claude/settings.json`（全局 Claude Code 配置文件），不属于本项目，故不计入项目评分。
- `npm audit` 因镜像源限制未能执行，建议偶尔用官方源跑一次。

---

### 3. 代码复杂度 ⭐⭐⭐ — 4 个问题

#### 🟡 警告：函数过长（超过 50 行）

| 文件 | 行号 | 函数 | 行数 | 建议 |
|------|------|------|------|------|
| `src/pages/SnakeGame.tsx` | 97-231 | `draw()` | 134 行 | 拆分为 `drawBackground()`、`drawFood()`、`drawSnake()`、`drawPauseOverlay()` 四个子函数 |
| `src/pages/SnakeGame.tsx` | 235-289 | `tick()` | 54 行 | 将碰撞检测逻辑抽取为 `checkCollision(head, snake, food)` |

#### 🟡 警告：重复代码（3 行以上高度相似）

| 文件 | 位置 | 说明 |
|------|------|------|
| `src/store/AppContext.tsx` | 行 72-82 | `getMonthIncome` 和 `getMonthExpense` 几乎完全一致，仅 `type` 值不同。可合并为 `getMonthTotal(month, type)` |
| `src/pages/SnakeGame.tsx` | 行 159-169 / 207-218 | 蛇头和蛇身的圆角矩形绘制代码几乎一样。可抽取为 `drawRoundedCell(x, y, radius)` |

#### ✅ 未发现问题

- 嵌套深度：所有函数嵌套均未超过 3 层，符合规范。
- 函数参数：所有函数参数不超过 4 个，符合规范。

---

### 4. 命名规范 ⭐⭐⭐⭐ — 8 个建议

#### 🔵 建议：非动词短语开头的函数名

| 文件 | 行号 | 当前名称 | 建议改为 | 原因 |
|------|------|----------|----------|------|
| `src/pages/SnakeGame.tsx` | 37 | `randomFood` | `generateRandomFood` | 函数做了生成 + 随机 + 碰撞检测，是动词操作，非名词 |
| `src/pages/SnakeGame.tsx` | 68 | `initialSnake` | `createInitialSnake` | 函数创建并返回初始蛇身 |
| `src/pages/Records.tsx` | 36 | `weekDay` | `getWeekDay` | 函数根据日期字符串计算并返回星期几 |

#### 🔵 建议：回调中过度缩写的变量名

| 文件 | 行号 | 当前写法 | 建议改为 | 原因 |
|------|------|----------|----------|------|
| `src/pages/SnakeGame.tsx` | 144 | `snake.forEach((seg, i) =>` | `(segment, i)` | "seg" 省了一个字母，但大幅降低可读性 |
| `src/pages/SnakeGame.tsx` | 146 | `const t = ...` | `const progress = ...` | 单字母 t 看不出含义，progress 一目了然 |
| `src/pages/Statistics.tsx` | 27 | `.reduce((s, d) => s + d.value, 0)` | `(sum, item)` | s/d 在 3 行前已定义 s 为不同用途（setCurrentMonth），容易混淆 |
| `src/pages/Records.tsx` | 29-30 | `.reduce((s, r) => s + r.amount, 0)` | `(sum, rec)` | sum 比 s 更清晰，rec 比 r 更明显 |
| `src/store/AppContext.tsx` | 74 | `.reduce((sum, r) => sum + r.amount, 0)` | 此处 sum 已正确，但同文件中又用 s 作累加器，建议统一为 sum |

---

### 5. TypeScript 类型 ⭐⭐⭐⭐ — 1 个问题

**✅ `npx tsc --noEmit` 通过，零类型错误。**

#### 🔵 发现：未使用的 import

| 文件 | 行号 | 问题 |
|------|------|------|
| `src/components/AddRecordModal.tsx` | 3 | `import { genId } from '../utils/storage'` — `genId` 在文件中未被使用（ID 由 Context 的 `addRecord` 内部生成） |

#### 关于 tsconfig 配置

当前 `noUnusedLocals` 和 `noUnusedParameters` 均设为 `false`。建议设为 `true`，可以在开发阶段就拦截未使用的变量和 import。

---

### 6. 未使用 / 被注释掉的代码

✅ 未在源码中发现被注释掉的代码块。代码保持干净。

#### 🔵 发现

| 文件 | 行号 | 说明 |
|------|------|------|
| `src/components/AddRecordModal.tsx` | 3 | 未使用的 `genId` 导入（同上） |
| `src/pages/SnakeGame.tsx` | 401 | `// eslint-disable-line react-hooks/exhaustive-deps` — 这是合理的明确禁用标注，非问题。但建议添加注释说明为什么 `paused` 不加入依赖数组（避免暂停恢复时残留 setTimeout） |

---

## 改进优先级

### 🔴 必须修复（影响可维护性，修复成本低）

1. **给 `src/utils/storage.ts` 的 10 个导出函数补上 JSDoc 注释** — 这是整个应用的数据层，所有页面都依赖它。AI 编码工具和新人阅读代码时，没有注释会显著降低理解速度。
2. **拆分 `SnakeGame.tsx` 的 `draw()` 函数（134 行）** — 超过 50 行的函数难以理解和测试。拆成 `drawBackground`、`drawFood`、`drawSnake`、`drawOverlay` 后，每个都独立、可复用。

### 🟡 建议修复（提升代码质量）

1. **消除重复代码** — 合并 `getMonthIncome`/`getMonthExpense` 为带参数的通用函数；抽取蛇身/蛇头的公共绘制逻辑。
2. **给 `AppContext.tsx` 的 4 个计算函数添加注释** — `getCategoryExpenseData` 和 `getMonthTrend` 逻辑较复杂，不注释很难快速理解。
3. **开启 `noUnusedLocals: true`** — 并删除 AddRecordModal.tsx 中未使用的 `genId` 导入。

### 🔵 可选优化（锦上添花）

1. **统一 reduce 累加器命名为 `sum`** — 当前混用 `s` 和 `sum`，建议全局统一。
2. **函数名改为动词开头** — `randomFood` → `generateRandomFood` 等，符合 JS 社区惯例。
3. **SnakeGame.tsx 添加 `// eslint-disable` 的说明注释** — 解释为什么 `paused` 不能加入 useEffect 依赖。
