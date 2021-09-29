#!/usr/bin/env sh

# 当发生错误时中止脚本
set -e

# 构建
npm run build

# cd 到构建输出的目录下
cd dist

# 部署到自定义域域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 部署到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 部署到 https://<USERNAME>.github.io/<REPO>
# 如果后端接口是 http 协议的，在部署 pages 时可以取消 强制https，保证接口可以访问
# 部署到 github
git push -f git@github.com:fuyi501/ailabel-me.git master:gh-pages

# 部署到 gitee
git push -f https://gitee.com/fuwenwei501/ailabel-me.git master:gh-pages

cd -