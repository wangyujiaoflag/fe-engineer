# 前端工程化实践

以vue项目为例

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## git 提交规范设置

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
    "path": "./node_modules/cz-conventional-changelog"
  }
}
```
