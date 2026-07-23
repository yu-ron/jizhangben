# 📝 注释检查报告

**时间**：2026-07-23 17:08
**扫描范围**：src/（排除 __tests__）

## 总览

| 指标 | 数值 |
|------|------|
| 扫描文件数 | 13 |
| 检查函数/逻辑块数 | 42 |
| 缺失注释 🔴 | 22 |
| 注释不足 🟡 | 6 |
| 合格 🟢 | 14 |

## 缺失注释 🔴

### src/utils/storage.ts（核心工具层，问题最多）

| 行号 | 函数/代码 | 问题 |
|------|----------|------|
| 55 | `function read<T>(key, fallback)` | 无注释。通用泛型函数，参数含义不直观（fallback 是什么？） |
| 64 | `function write<T>(key, data)` | 无注释。数据写入逻辑，需说明格式（JSON.stringify） |
| 70 | `export function getRecords()` | 无注释。导出函数，未说明返回值和来源 |
| 74 | `export function saveRecords(records)` | 无注释 |
| 78 | `export function addRecord(record)` | 无注释。关键的 CRUD 操作 |
| 85 | `export function deleteRecord(id)` | 无注释 |
| 93 | `export function getCategories()` | 无注释。内部有首次初始化逻辑，未在函数级说明 |
| 104 | `export function saveCategories(categories)` | 无注释 |
| 110 | `export function getBudget()` | 无注释 |
| 114 | `export function saveBudget(budget)` | 无注释 |

### src/store/AppContext.tsx（全局状态，逻辑复杂）

| 行号 | 函数/代码 | 问题 |
|------|----------|------|
| 31 | `export function AppProvider()` | 无注释。整个应用的状态管理中心 |
| 84 | `getCategoryExpenseData` | 无注释。复杂逻辑：分组→排序→配色→输出，需解释每一步 |
| 99 | `getMonthTrend` | 无注释。`month.slice(5)` 为什么取后两位？不直观 |
| 118 | `export function useApp()` | 无注释。自定义 Hook，未说明必须包在 AppProvider 内使用 |

### src/components/

| 文件 | 行号 | 函数 | 问题 |
|------|------|------|------|
| AddRecordModal.tsx | 11 | `AddRecordModal` | 无注释。弹窗组件，未说明 props 含义 |
| BudgetBar.tsx | 4 | `BudgetBar` | 无注释。预算进度条，百分比的边界处理未说明 |
| MonthPicker.tsx | 6 | `MonthPicker` | 无注释。月份选择器，日期计算逻辑未说明 |
| Layout.tsx | 11 | `Layout` | 无注释。布局组件，未说明底部导航和内容区的关系 |

### src/pages/

| 文件 | 行号 | 函数 | 问题 |
|------|------|------|------|
| Home.tsx | 6 | `Home` | 无注释。首页组件 |
| Home.tsx | 80 | `RecentRecords` | 无注释 |
| Records.tsx | 6 | `Records` | 无注释 |
| Settings.tsx | 7 | `Settings` | 无注释 |
| Settings.tsx | 175 | `CategoryRow` | 无注释 |
| Statistics.tsx | 6 | `Statistics` | 无注释 |
| App.tsx | 9 | `App` | 无注释。路由配置入口 |

## 注释不足 🟡

| 文件 | 行号 | 函数 | 现有注释 | 问题 |
|------|------|------|----------|------|
| AppContext.tsx | 37 | `// ===== 记录操作 =====` | 分隔注释 | 只标了"是什么模块"，没解释每个函数做什么 |
| AppContext.tsx | 49 | `// ===== 分类操作 =====` | 同上 | 同上 |
| AppContext.tsx | 63 | `// ===== 预算操作 =====` | 同上 | 同上 |
| AppContext.tsx | 71 | `// ===== 计算 =====` | 同上 | 同上，且计算逻辑复杂，应逐个函数注释 |
| AddRecordModal.tsx | 25 | `handleSubmit` | `// 重置表单` | 只注释了清理部分，没说前面的校验逻辑 |
| Statistics.tsx | 15 | `trendMonths` | 无单独注释 | 日期循环生成近 6 月列表，移月逻辑容易搞混 |

## 合格示例 🟢

| 文件 | 函数 | 说明 |
|------|------|------|
| storage.ts | `genId()` | ✅ `/** 生成唯一 ID */` JSDoc 风格 |
| storage.ts | `getCurrentMonth()` | ✅ `/** 获取当前月份字符串 YYYY-MM */` |
| SnakeGame.tsx | `randomFood()` | ✅ `/** 生成随机食物位置，不能和蛇身重叠 */` |
| SnakeGame.tsx | `initialSnake()` | ✅ `/** 初始蛇：中间偏左，长度 3 */` |
| SnakeGame.tsx | 各区段 | ✅ `// ========== xxx ==========` 清晰的分隔注释 |
| SnakeGame.tsx | 核心逻辑 | ✅ 如 `// 应用缓冲方向（防止反向自杀）` |
