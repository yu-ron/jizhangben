# 记账本 — 产品文档

## 项目概述

**记账本**是一个轻量级个人记账 Web 应用，帮助用户轻松管理日常收支。无需注册登录，打开浏览器即用，所有数据保存在本地浏览器中，隐私安全。

- **平台**：网页版 (Web App)，手机和电脑浏览器均可使用
- **技术栈**：React 18 + TypeScript + Vite + Tailwind CSS + Recharts
- **数据存储**：localStorage 本地存储

## 功能模块

### 1. 记一笔（收支记录）
- 记录金额、分类、日期、备注
- 支持收入/支出两种类型切换
- 弹出式表单，快速录入

### 2. 首页仪表盘
- 月度收支概览：总收入、总支出、结余
- 预算进度条：展示月度预算使用百分比
- 最近 5 条记录快速查看

### 3. 账单列表
- 按月份筛选查看
- 按日期分组展示，含每日小计
- 支持滑动删除记录

### 4. 统计图表
- **分类饼图**：月度支出按分类分布
- **趋势柱状图**：近 6 月收入/支出对比

### 5. 分类管理
- 预设 15 个常用收支分类（含 emoji 图标）
- 支持自定义添加和删除分类

### 6. 预算管理
- 设置月度预算金额
- 首页展示预算使用进度和剩余额度
- 超支时进度条变红提醒

## 技术架构

```
记账app/
├── index.html                   # 入口 HTML
├── package.json                 # 依赖配置
├── vite.config.ts               # Vite 构建配置
├── tsconfig.json                # TypeScript 配置
├── tailwind.config.js           # Tailwind CSS 配置
├── postcss.config.js            # PostCSS 配置
├── CLAUDE.md                    # 产品文档（本文件）
└── src/
    ├── main.tsx                 # React 入口
    ├── App.tsx                  # 路由配置
    ├── index.css                # 全局样式 + Tailwind
    ├── utils/
    │   └── storage.ts           # 数据模型 + localStorage 读写 + 工具函数
    ├── store/
    │   └── AppContext.tsx        # React Context 全局状态管理
    ├── components/
    │   ├── Layout.tsx           # 底部导航栏布局
    │   ├── AddRecordModal.tsx   # 记一笔弹窗
    │   ├── BudgetBar.tsx        # 预算进度条
    │   └── MonthPicker.tsx      # 月份选择器
    └── pages/
        ├── Home.tsx             # 首页仪表盘
        ├── Records.tsx          # 账单列表
        ├── Statistics.tsx       # 统计图表
        └── Settings.tsx         # 分类管理 + 预算设置
```

## 数据模型

```typescript
// 记账记录
interface Record {
  id: string;          // 唯一 ID
  amount: number;      // 金额
  type: 'income' | 'expense';
  categoryId: string;  // 关联分类 ID
  date: string;        // YYYY-MM-DD
  note: string;        // 备注（可选）
}

// 收支分类
interface Category {
  id: string;
  name: string;        // 分类名称，如"餐饮"
  type: 'income' | 'expense';
  icon: string;        // emoji 图标
}

// 预算
interface Budget {
  month: string;       // YYYY-MM
  amount: number;      // 月度预算金额
}
```

## 开发指南

### 启动开发环境

```bash
npm install        # 安装依赖（首次）
npm run dev        # 启动开发服务器 → http://localhost:5173
```

### 构建生产版本

```bash
npm run build      # 输出到 dist/ 目录
npm run preview    # 预览生产构建
```

### 注意事项

1. **Node.js 路径问题**：Windows 下 npm 的 postinstall 脚本可能找不到 node 命令，需要在 Git Bash 中运行 `export PATH="/e/Qoder:$PATH"` 或等效路径后再执行 npm 命令。

2. **数据存储**：所有数据存在浏览器的 localStorage 中，键名前缀为 `jzb_`。清除浏览器数据会导致账本数据丢失，如需保留请定期导出（功能待开发）。

3. **移动端适配**：页面最大宽度 480px，适配手机屏幕。底部导航栏使用 fixed 定位，注意 safe-area 适配。

4. **预设分类**：首次使用时自动写入 10 个支出分类和 5 个收入分类，用户可自行删除或添加。

5. **路由**：使用 react-router-dom v6，共 4 个路由：`/`、`/records`、`/statistics`、`/settings`。

## 未来可扩展功能

- [ ] 数据导出为 Excel/CSV
- [ ] 账单搜索和高级筛选
- [ ] 年度统计报表
- [ ] 多账本支持
- [ ] 周期性记账（每月固定账单自动记录）
- [ ] 云端备份与多设备同步
