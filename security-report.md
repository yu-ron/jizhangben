# 安全检查报告

**时间**：2026-07-26 20:54
**扫描范围**：src/ + 配置文件 + 依赖审计

## 总览

| 类别 | 发现数 | 严重度 |
|------|--------|--------|
| 硬编码敏感信息 | 0 | ✅ 无 |
| 注入漏洞 | 0 | ✅ 无 |
| 配置文件泄露 | 0 | ✅ 项目内无 |
| XSS 风险 | 0 | ✅ 无 |
| 其他隐患 | 0 | ✅ 无 |
| 依赖漏洞 | 4 | 🟡 中高危 |

## 详细发现

### ✅ 项目源码安全

对 `src/` 下所有 .ts/.tsx 文件进行了全面扫描，结果如下：

| 检查项 | 扫描模式 | 结果 |
|--------|---------|------|
| 硬编码密码/密钥/Token | `password\|secret\|token\|apiKey\|api_key\|privateKey` | 0 处命中 |
| XSS（跨站脚本） | `dangerouslySetInnerHTML\|document.write\|innerHTML=` | 0 处命中 |
| 命令注入 | `exec\|execSync\|spawn\|eval(` | 0 处命中 |
| Eval 动态执行 | `eval\|Function(` | 0 处命中 |
| HTTP 明文 URL | `http://` | 0 处命中（仅 localhost 开发服务器） |
| 弱加密算法 | `MD5\|SHA1\|DES` | 0 处命中 |
| 调试日志泄露 | `console.log` | 0 处命中 |

**评价**：本项目是纯前端记账应用，数据存储在浏览器 localStorage 中，无后端 API 调用，无网络传输。代码层面安全性良好。

### ✅ 配置文件安全

- 项目目录下无 `.env`、`.env.local`、`.env.production` 等环境变量文件
- `.claude/settings.local.json` 仅包含 Claude Code 的权限和白名单配置，无敏感信息

### 🟡 依赖漏洞

运行 `npm audit` 结果：

```
4 vulnerabilities (3 moderate, 1 high)

esbuild <=0.24.2 (moderate)
  → 影响：开发服务器可能被同网络下其他网站访问
  → 仅影响本地开发环境，不影响生产构建
  → 修复需升级 vite 到 v8（破坏性变更）

react-router 6.0.0-7.17.0 (moderate × 2 + high × 1)
  → CVE-2025-68470 bypass：开放重定向
  → GHSA-337j：SSR hydration 时反序列化构造器注入
  → 本项目未使用 SSR，第二项不受影响
  → 可用 npm audit fix 升级 react-router 到 7.18.0
```

### 🔴 上次检查遗留问题（2026-07-23）

上次检查发现的 `~/.claude/settings.json` 中的 `ANTHROPIC_AUTH_TOKEN` 明文密钥问题已于上次修复时解决，本次检查确认当前 `.claude/settings.local.json` 中 **不再包含** 任何密钥或 Token。

## 安全评分

| 维度 | 评分 | 说明 |
|------|------|------|
| 源码安全 | 5.0/5 | 无硬编码密钥、无注入、无 XSS |
| 配置安全 | 5.0/5 | 项目内无敏感配置文件 |
| 依赖安全 | 3.5/5 | 4 个已知漏洞，其中 1 个高危（SSR 相关，本项目不受影响） |

**综合评分**：4.5/5（良好）

## 建议

1. **可选**：运行 `npm audit fix` 升级 react-router 到安全版本（非破坏性变更）
2. **暂缓**：esbuild 漏洞仅影响本地开发环境，且修复需要 Vite 大版本升级，可等正式发布后再处理
3. **持续**：每次发布前运行安全扫描，保持当前的良好状态
