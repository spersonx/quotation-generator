# 报价易 — 专业报价单生成器

<p align="center">
  <img src="public/favicon.png" width="64" height="64" alt="报价易 Logo">
</p>

<p align="center">
  <strong>专业报价，一键即达</strong>
</p>

<p align="center">
  <a href="https://github.com/spersonx/quotation-generator/actions"><img src="https://img.shields.io/github/actions/workflow/status/spersonx/quotation-generator/deploy.yml?branch=main" alt="Build Status"></a>
  <a href="https://spersonx.github.io/quotation-generator/"><img src="https://img.shields.io/badge/在线演示-点击访问-blue" alt="Live Demo"></a>
  <a href="https://github.com/spersonx/quotation-generator/releases"><img src="https://img.shields.io/github/v/release/spersonx/quotation-generator?label=桌面版下载" alt="Desktop Release"></a>
</p>

---

## 简介

**报价易**是一款面向企业销售与商务人员的在线报价单生成工具。无需注册、无需安装，打开浏览器即可快速创建专业报价单，支持 PDF 导出与 Excel 导入，数据完全保留在本地，保护客户隐私。

同时提供 **桌面客户端**（Windows / macOS / Linux），基于 Neutralino.js 构建，离线可用，数据更安全。

> **专 · 简 · 安 · 效** — 专注报价场景，简化操作流程，保障数据安全，提升工作效率。

---

## 核心功能

| 功能 | 说明 |
|------|------|
| **分步引导编辑** | 基本信息 → 公司与客户 → 项目明细 → 金额汇总 → 模板市场 → 预览导出，六步完成报价单 |
| **Excel 快速导入** | 支持上传 Excel 表格，自动解析产品/项目明细，一键填入报价单 |
| **多模板选择** | 内置简约、商务蓝、印章红、雅致绿、奢华金五种专业模板，一键切换风格 |
| **PDF / 图片导出** | 基于 html2canvas + jsPDF 实现，导出效果所见即所得 |
| **数据本地存储** | 所有数据保存在浏览器 localStorage，不上传服务器，关闭页面即销毁 |
| **新手教程** | 首次使用自动弹出引导，覆盖首页到导出的完整流程 |
| **历史记录** | 支持本地保存/加载 JSON 文件，方便归档与复用 |
| **桌面客户端** | 支持 Windows / macOS / Linux，离线使用，原生文件保存对话框 |

---

## 技术栈

- **前端框架**: Vue 3 + Vite + TypeScript
- **UI 组件库**: Element Plus
- **状态管理**: Pinia
- **路由管理**: Vue Router
- **PDF 导出**: html2canvas + jsPDF
- **Excel 解析**: xlsx
- **桌面客户端**: Neutralino.js 5
- **静态部署**: GitHub Pages + GitHub Actions

---

## 快速开始

### 在线使用

直接访问 [在线演示](https://spersonx.github.io/quotation-generator/)，无需安装。

### 桌面版下载

前往 [Releases](https://github.com/spersonx/quotation-generator/releases) 下载对应平台可执行文件：

| 平台 | 文件 | 说明 |
|------|------|------|
| Windows | `baojiayi-win_x64.exe` | 64 位可执行文件 |
| macOS | `baojiayi-mac_x64` | Intel 芯片 |
| Linux | `baojiayi-linux_x64` | 64 位可执行文件 |

下载后解压整个文件夹，双击可执行文件即可运行。

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/spersonx/quotation-generator.git
cd quotation-generator

# 安装依赖
npm install

# 安装 Neutralino 二进制文件
npx neu update

# 启动开发服务器（Web）
npm run dev

# 构建并启动桌面客户端
npm run neu:dev
```

### 构建

```bash
# 构建 Web 版本
npm run build

# 构建桌面客户端分发包
npm run neu:build
```

构建产物位于 `dist/baojiayi/` 目录。

---

## 部署到 GitHub Pages

本项目已配置 GitHub Actions 自动部署工作流。

1. 将代码推送至 `main` 分支
2. 进入仓库 **Settings → Pages**
3. Source 选择 **GitHub Actions**
4. 每次 `push` 到 `main` 分支将自动触发部署

---

## 发布桌面版

推送版本标签即可自动构建并发布到 GitHub Releases：

```bash
git tag v1.0.0
git push origin v1.0.0
```

GitHub Actions 会在 Windows / macOS / Linux 三个平台并行构建，自动创建 Release 并上传可执行文件。

---

## 项目结构

```
├── .github/workflows/
│   ├── deploy.yml           # GitHub Pages 部署
│   └── release.yml          # 桌面版自动发布
├── public/
│   └── favicon.png          # 应用图标
├── src/
│   ├── assets/              # 静态资源
│   ├── components/          # 公共组件
│   │   ├── CompanyForm.vue  # 公司信息表单
│   │   ├── CustomerForm.vue # 客户信息表单
│   │   ├── ItemTable.vue    # 项目明细表格
│   │   ├── QuotationPreview.vue # 报价单预览
│   │   ├── SummaryPanel.vue # 金额汇总面板
│   │   ├── TemplateMarket.vue # 模板市场
│   │   └── TutorialGuide.vue  # 新手教程
│   ├── router/
│   │   └── index.ts         # 路由配置
│   ├── stores/
│   │   ├── quotation.ts     # 报价单数据管理
│   │   ├── settings.ts      # 设置管理
│   │   └── template.ts      # 模板数据管理
│   ├── styles/              # 全局样式
│   ├── types/
│   │   └── index.ts         # TypeScript 类型定义
│   ├── utils/
│   │   ├── excel.ts         # Excel 导入导出
│   │   ├── helpers.ts       # 工具函数
│   │   ├── neutralino.ts    # Neutralino 兼容层
│   │   ├── pdf.ts           # PDF / 图片导出
│   │   └── storage.ts       # 本地存储封装
│   ├── views/
│   │   ├── HomeView.vue     # 首页
│   │   ├── EditorView.vue   # 报价单编辑器
│   │   └── PreviewView.vue  # 预览与导出
│   ├── App.vue              # 应用入口
│   └── main.ts              # 入口文件
├── index.html
├── neutralino.config.json   # Neutralino 配置
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 品牌

- **名称**: 报价易
- **Slogan**: 专业报价，一键即达
- **价值观**: 专 · 简 · 安 · 效

---

## 许可证

[Apache-2.0](LICENSE)
