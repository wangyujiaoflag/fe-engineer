# 前端工程化实践

demo：vue3 + ts + vite + vue-router

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## 一、git 提交规范设置

```bash
# 1.依赖安装
pnpm add -D husky lint-staged @commitlint/cli @commitlint/config-conventional commitizen cz-conventional-changelog

# 2.初始化husky
npx husky

## package.json 添加 prepare 脚本 以便其他成员安装后自动启用husky
"scripts": {
  "prepare": "husky install"
}

# 3.配置lint-staged（提交前自动格式化/校验代码）

## 安装依赖
pnpm add -D eslint prettier @vue/eslint-config-typescript eslint-plugin-vue

## 在package.json中添加
"lint-staged": {
  "*.{js,ts,vue}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{css,scss}": [
    "prettier --write"
  ]
}

# 4.添加pre-commit钩子
## 运行 pnpm prepare 命令 初始化husky

## 在.husky目录下新建pre-commit文件,文件内容如下：
#!/usr/bin/env sh
npx lint-staged

## 给 hook 加执行权限
chmod +x .husky/pre-commit

# 5.配置commitlint（规范提交信息）
## 添加commit-msg钩子 提交的时候会用commitlint校验，然后它默认会找commitlint.config.js配置文件

## 创建 commitlint.config.js 文件,内容如下：
module.exports = {
  extends: ['@commitlint/config-conventional']
};

## 在.husky下新建commit-msg文件，内容如下：
#!/usr/bin/env sh
npx --no -- commitlint --edit "$1"

## 赋予执行权限
chmod +x .husky/commit-msg

# 6. commitizen 交互式提交
## 在 package.json 中添加以下内容 后期可以直接使用pnpm commit 提交
"scripts": {
  "cz": "cz"
},
## 终端执行 使用cz-conventional-changelog适配器
pnpm commitizen init cz-conventional-changelog --pnpm --save-dev --save-exact

## package.json中就会生成以下代码
"config": {
  "commitizen": {
    "path": "cz-conventional-changelog"
  }
}
```

## 二、CI/CD 持续集成和部署

- CI: 在`github/仓库/.github/workflows/ci.yml`（触发分支、设置pnpm、nodejs，安装依赖、类型检查、构建、测试、打包）
- CD: 在`github/仓库/.github/workflows/deploy.yml`（配置pages环境、构建、上传产物；部署到pages-依赖build任务成功完成）

- 部署出现的问题---页面空白：
  - github Pages部署时，网站会被访问在`https://用户名.github.io/仓库名/`的子路径下，而vite默认构建时假设资源都放在根路径/下，导致实际请求的资源路径变成了`https://用户名.github.io/js/chunk.js`而不是`https://用户名.github.io/仓库名/js/chunk.js`,所以页面加载不到资源，呈现空白
    - 解决：vite.config.ts 中设置base

  - vue应用使用了history模式，github pages静态服务器上，直接访问非首页的路径或刷新页面时，服务器找不到对应的文件，导致页面空白
    - 解决： 改用hash模式/保留history模式，添加一个404.html回退

## 三、测试（单元测试/端到端测试E2E/自动化测试）

```bash
# 单元测试
pnpm add -D @vitest/coverage-v8 vitest jsdom @vue test-utils
## vite.config.ts添加
test: {
  environment: 'jsdom',
  coverage: { provider: 'v8' },
},
## package.json scripts添加
"test": "vitest",
"test:coverage": "vitest --coverage",
```

## 四、自动化版本管理与变更日志

规范版本号（semver），自动生成 CHANGELOG，避免手动修改的麻烦

流程：

1. 在功能都合并到master，ci通过后
2. 在本地执行一个发布命令
3. 然后会更新package.json版本号、生成/更新CHANGELOG.md、创建git tag）
4. 最后推到远程git push origin master --follow-tags

```bash
# 使用 standard-version（轻量）
pnpm add -D standard-version

## 在package.json script添加下面内容

### 适合日常发版 会根据提交记录自动判断版本号类型，有feat->升minor，有fix->升patch，有BREAKING CHANGE->升major
"release": "standard-version",

### 强制升级次版本号，如1.2.3->1.3.0 不管最近提交的是什么类型
### 用在「本次迭代是新增功能版本」但提交类型比较杂、想明确就是一个小版本发布时
"release:minor": "standard-version --release-as minor",

### 强制升级主版本号（例如 1.2.3 → 2.0.0）
### 用在「有重大破坏性变更」或你决定这是一个大版本发布时
"release:major": "standard-version --release-as major"
```

## 五、依赖更新管理（锁文件、版本控制）

每周自动提 PR 更新依赖，CI 会帮你验证是否破坏功能

- 官方 Dependabot：内置、零服务部署、适合个人/小团队。
- 第三方 Renovate：更灵活、规则更强，但需要装 GitHub App。

保持依赖安全且最新，减少手动检查。GitHub 原生支持 Dependabot，只需在仓库 `.github/dependabot.yml` 配置

```bash
version: 2
updates:
  - package-ecosystem: "npm"      # pnpm 也用 npm 生态
    directory: "/"                # package.json 所在目录
    schedule:
      interval: "weekly"          # 每周检查一次
    ignore:
      - dependency-name: "vite"   # 忽略 Vite 大版本更新
        update-types: ["version-update:semver-major"]
    groups:
      vite-and-vue:               # vite和vue更新放在同一个PR
        patterns:
          - "vite"
          - "vue"
  - package-ecosystem: "github-actions"  # 每月检查一次github actions 的 action 版本
    directory: "/"
    schedule:
      interval: "monthly"
```

## 六、构建优化（Vite配置优化、分包、懒加载等）

```bash
# 分析产物，看打包构成
pnpm add -D rollup-plugin-visualizer
## vite.config.ts 中添加
import { visualizer } from 'rollup-plugin-visualizer'
plugins: [
  visualizer({ open: true })
]
```

## 七、Mock

```bash
pnpm add -D vite-plugin-mock mockjs
# 配置vite.config.ts
import { viteMockServe } from 'vite-plugin-mock'
export default defineConfig({
  plugins: [vue(), viteMockServe({ supportTs: true })]
})
```

## 八、文档系统（Storybook/Vitepress）

有组件库或复杂组件，搭建 Storybook 可以独立展示组件状态，提升协作效率。

## 九、性能监控与错误追踪

Sentry/FrontJS 捕获前端运行时错误和性能数据

```bash
pnpm add @sentry/vue @sentry/tracing
# 在 main.ts 中初始化，上报错误。CI/CD 时可自动上传 sourcemap 以便定位源码
```

## 十、axios请求封装、路径别名配置、环境变量管理、包管理（npm/pnpm/yarn）、目录结构规范等等
