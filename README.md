# 🧾 记账本

一个轻量级个人记账应用，帮助轻松管理日常收支。无需注册登录，打开浏览器即用，所有数据保存在本地浏览器中，隐私安全。

## ✨ 功能

- **📝 记一笔** — 弹出式表单，快速记录金额、分类、日期、备注，支持收入/支出切换
- **📊 首页仪表盘** — 月度收支概览（收入/支出/结余）、预算进度条、最近 5 条记录
- **📋 账单列表** — 按月份筛选，按日期分组，含每日小计，支持滑动删除
- **📈 统计图表** — 分类饼图（支出分布）+ 趋势柱状图（近 6 月收支对比）
- **🏷️ 分类管理** — 预设 15 个常用分类（含 emoji 图标），支持自定义增删
- **💰 预算管理** — 设置月度预算，首页展示使用进度，超支时红色预警

## 🛠 技术栈

| 技术 | 用途 |
|------|------|
| React 18 | 前端框架，构建用户界面 |
| TypeScript | 类型安全的 JavaScript |
| Vite | 开发服务器和构建打包工具 |
| Tailwind CSS | 原子化 CSS 样式框架 |
| Recharts | 统计图表（饼图、柱状图） |
| localStorage | 浏览器本地数据存储 |

## 🚀 本地运行

```bash
# 1. 安装依赖（首次运行）
npm install

# 2. 启动开发服务器
npm run dev

# 3. 浏览器打开 http://localhost:5173
```

### 构建生产版本

```bash
npm run build     # 输出到 dist/ 目录
npm run preview   # 预览生产构建
```

> **Windows 用户注意**：如果 npm 命令报错找不到 node，请先在 Git Bash 中执行 `export PATH="/e/Qoder:$PATH"`，再运行上述命令。

## 📱 适配

页面最大宽度 480px，在手机和电脑浏览器上均有良好体验。底部导航栏适配了手机的 safe-area。

## ⚠️ 数据说明

所有记账数据保存在浏览器 localStorage 中，键名前缀为 `jzb_`。**清除浏览器缓存/历史记录会导致数据丢失**，建议定期使用导出功能备份（开发中）。

## 📂 项目结构

```
src/
├── main.tsx                 # 应用入口
├── App.tsx                  # 路由配置
├── index.css                # 全局样式
├── utils/
│   └── storage.ts           # 数据模型与读写逻辑
├── store/
│   └── AppContext.tsx        # 全局状态管理
├── components/
│   ├── Layout.tsx           # 底部导航栏
│   ├── AddRecordModal.tsx   # 记一笔弹窗
│   ├── BudgetBar.tsx        # 预算进度条
│   └── MonthPicker.tsx      # 月份选择器
└── pages/
    ├── Home.tsx             # 首页仪表盘
    ├── Records.tsx          # 账单列表
    ├── Statistics.tsx       # 统计图表
    └── Settings.tsx         # 分类管理与预算设置
```

## 📋 未来计划

- [ ] 数据导出为 Excel/CSV
- [ ] 账单搜索和高级筛选
- [ ] 年度统计报表
- [ ] 多账本支持
- [ ] 周期性记账（固定账单自动记录）
- [ ] 云端备份与多设备同步

## 📄 许可

MIT License
