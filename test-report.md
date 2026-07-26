# 测试报告

**生成时间**：2026-07-26 20:26

**测试框架**：Vitest

**测试结果**：11/11 全部通过

---

## 测试套件摘要

| 测试套件 | 文件 | 测试数 | 通过 | 失败 | 状态 |
|---------|------|--------|------|------|------|
| 记账记录 (Records) | src/__tests__/storage.test.ts | 4 | 4 | 0 | PASSED |
| 收支分类 (Categories) | src/__tests__/storage.test.ts | 2 | 2 | 0 | PASSED |
| 预算 (Budget) | src/__tests__/storage.test.ts | 2 | 2 | 0 | PASSED |
| 工具函数 | src/__tests__/storage.test.ts | 3 | 3 | 0 | PASSED |

---

## 详细测试结果

### 记账记录 (Records)

| # | 测试名称 | 状态 |
|---|---------|------|
| 1 | 初始时应该返回空数组 | PASSED |
| 2 | 添加一条记录后，列表中应该有这条记录 | PASSED |
| 3 | 删除记录后，列表应该变空 | PASSED |
| 4 | saveRecords 可以一次性保存多条记录 | PASSED |

### 收支分类 (Categories)

| # | 测试名称 | 状态 |
|---|---------|------|
| 5 | 首次调用应该返回预设的默认分类 | PASSED |
| 6 | 可以保存自定义分类 | PASSED |

### 预算 (Budget)

| # | 测试名称 | 状态 |
|---|---------|------|
| 7 | 初始时返回默认空预算 | PASSED |
| 8 | 可以设置和读取预算 | PASSED |

### 工具函数

| # | 测试名称 | 状态 |
|---|---------|------|
| 9 | genId 生成的是字符串，长度大于 0 | PASSED |
| 10 | genId 连续两次调用应该生成不同的 ID | PASSED |
| 11 | getCurrentMonth 返回 YYYY-MM 格式 | PASSED |
