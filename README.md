# 报价易 — 专业报价单生成器

<p align="center">
  <img src="public/favicon.svg" width="64" height="64" alt="报价易 Logo">
</p>

<p align="center">
  <strong>专业报价，一键即达</strong>
</p>

<p align="center">
  <a href="https://github.com/你的用户名/quotation-generator/actions"><img src="https://img.shields.io/github/actions/workflow/status/你的用户名/quotation-generator/deploy.yml?branch=main" alt="Build Status"></a>
  <a href="https://你的用户名.github.io/quotation-generator/"><img src="https://img.shields.io/badge/在线演示-点击访问-blue" alt="Live Demo"></a>
</p>

---

## 简介

**报价易**是一款面向企业销售与商务人员的在线报价单生成工具。无需注册、无需安装，打开浏览器即可快速创建专业报价单，支持 PDF 导出与 Excel 导入，数据完全保留在本地，保护客户隐私。

> **专 · 简 · 安 · 效** — 专注报价场景，简化操作流程，保障数据安全，提升工作效率。

---

## 核心功能

| 功能 | 说明 |
|------|------|
| **分步引导编辑** | 基本信息 → 公司与客户 → 项目明细 → 金额汇总 → 模板市场 → 预览导出，六步完成报价单 |
| **Excel 快速导入** | 支持上传 Excel 表格，自动解析产品/项目明细，一键填入报价单 |
| **多模板选择** | 内置简约、商务蓝、印章红、雅致绿、奢华金五种专业模板，一键切换风格 |
| **PDF 导出** | 基于 html2canvas + jsPDF 实现，导出效果所见即所得 |
| **数据本地存储** | 所有数据保存在浏览器 localStorage，不上传服务器，关闭页面即销毁 |
| **新手教程** | 首次使用自动弹出引导，覆盖首页到导出的完整流程 |
| **历史记录** | 支持本地保存/加载 JSON 文件，方便归档与复用 |

---

## 技术栈

- **前端框架**: Vue 3 + Vite + TypeScript
- **UI 组件库**: Element Plus
- **状态管理**: Pinia
- **路由管理**: Vue Router
- **PDF 导出**: html2canvas + jsPDF
- **Excel 解析**: xlsx
- **静态部署**: GitHub Pages + GitHub Actions

---

## 快速开始

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/你的用户名/quotation-generator.git
cd quotation-generator

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 构建生产版本

```bash
npm run build
```

构建产物位于 `dist/` 目录，可直接部署到任意静态托管服务。

---

## 部署到 GitHub Pages

本项目已配置 GitHub Actions 自动部署工作流。

1. 在 GitHub 创建仓库，将代码推送至 `main` 分支
2. 进入仓库 **Settings → Pages**
3. Source 选择 **GitHub Actions**
4. 每次 `push` 到 `main` 分支将自动触发部署

---

## 项目结构

```
├── public/
│   ├── favicon.svg          # 品牌图标
│   └── landing/             # 品牌落地页
│       └── index.html
├── src/
│   ├── assets/              # 静态资源
│   ├── components/          # 公共组件
│   │   ├── ItemTable.vue    # 项目明细表格
│   │   ├── SummaryPanel.vue # 金额汇总面板
│   │   ├── TemplateMarket.vue # 模板市场
│   │   └── TutorialGuide.vue  # 新手教程
│   ├── stores/
│   │   ├── quotation.ts     # 报价单数据管理
│   │   └── template.ts      # 模板数据管理
│   ├── utils/
│   │   ├── excel.ts         # Excel 导入导出
│   │   ├── helpers.ts       # 工具函数
│   │   └── storage.ts       # 本地存储封装
│   ├── views/
│   │   ├── HomeView.vue     # 首页
│   │   ├── EditorView.vue   # 报价单编辑器
│   │   └── PreviewView.vue  # 预览与导出
│   ├── App.vue              # 应用入口
│   └── main.ts              # 入口文件
├── .github/workflows/
│   └── deploy.yml           # GitHub Actions 部署配置
├── index.html
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

[MIT](LICENSE)
