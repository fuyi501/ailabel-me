# 图像标注系统

[![AILabel](https://img.shields.io/badge/AILabel-5.0.20-brightgreen.svg)](https://github.com/dingyang9642/AILabel)
[![vue](https://img.shields.io/badge/vue-2.6.11-brightgreen.svg)](https://github.com/vuejs/vue)
[![element-ui](https://img.shields.io/badge/element--ui-2.15.6-brightgreen.svg)](https://github.com/ElemeFE/element)
[![license](https://img.shields.io/badge/license-Apache%202.0-blue)](https://github.com/fuyi501/ailabel-me/blob/master/LICENSE)

本项目基于 [vue-admin-template](https://github.com/fuyi501/vue-admin-template) 和 [AILabel](https://github.com/dingyang9642/AILabel) 设计，可以标注车道线，区域等各种交通区域设施，用于配置智慧交通检测事件，设置车道的方向和区域的检测事件，应用于智慧交通融合感知系统。

- [github 仓库](https://github.com/fuyi501/ailabel-me)
- [github 在线预览](https://fuyi501.github.io/ailabel-me)
- [gitee 仓库](https://gitee.com/fuwenwei501/ailabel-me.git)
- [gitee 在线预览](https://gitee.com/fuwenwei501/ailabel-me)

## 安装

```sh
# 克隆项目
# github
git clone https://github.com/fuyi501/ailabel-me.git

# gitee
git clone https://gitee.com/fuwenwei501/ailabel-me.git

# 进入项目目录
cd ailabel-me

# 安装依赖
npm install

# 启动项目
npm run serve

# 编译项目
npm run build
```

## 功能

- 矩形标注
- 多边形标注
- 车道线设置
- 区域设置
- 交通异常事件配置
- 道路设置
- 监控设置

## 效果展示

![](https://alioss.fuwenwei.com/img/20210928184745.png)

![](https://alioss.fuwenwei.com/img/20210928184831.png)

![](./images/ailabel.gif)

## 部署

### GitHub Pages
GitHub Pages 部署请看：https://cli.vuejs.org/zh/guide/deployment.html#github-pages

### Docker (Nginx)

1、安装 [Docker](https://www.docker.com/get-started)

2、编译项目文件

```sh
npm run build
```

3、使用 nginx 镜像构建 vue 应用镜像

```sh
docker pull nginx
```

4、创建 nginx 配置文件

在项目根目录下创建 `nginx` 文件夹，该文件夹下新建文件 `default.conf`

```sh
server {
    listen       80;
    server_name  localhost;

    #charset koi8-r;
    access_log  /var/log/nginx/host.access.log  main;
    error_log  /var/log/nginx/error.log  error;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}

```

该配置文件定义了首页的指向为 `/usr/share/nginx/html/index.html`, 所以我们可以一会把构建出来的 index.html 文件和相关的静态资源放到 `/usr/share/nginx/html` 目录下。

5、创建 Dockerfile 文件

```dockerfile
FROM nginx
COPY dist/ /usr/share/nginx/html/
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
```

6、基于该 Dockerfile 构建应用镜像

```sh
# 注意不要少了最后的 “.”
# -t 是给镜像命名 . 是基于当前目录的 Dockerfile 来构建镜像
docker build -t ailabel-me .
```

7、运行应用镜像

```sh
docker run -d -p 8088:80 --name=ailabel-me ailabel-me
```

## 相关信息

本项目基于 [AILabel](https://github.com/dingyang9642/AILabel) 设计，`AILabel` 类库是一款集打点、线段、多段线、矩形、多边形、圆圈、涂抹等多标注形式于一体，附加文本（Text）、标记（Marker）、缩略图（EagleMap）、Scale（比例尺）等控件以及 Util 等辅助工具的在线 Web 端标注工具库。

- 源代码：[https://github.com/dingyang9642/AILabel](https://github.com/dingyang9642/AILabel)

- API 文档：[http://ailabel.com.cn/public/ailabel/api/index.html](http://ailabel.com.cn/public/ailabel/api/index.html)

## 浏览器支持

Modern browsers and Internet Explorer 10+.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- | --------- | --------- |
| IE10, IE11, Edge | last 2 versions | last 2 versions | last 2 versions |

## License

[Apache](https://github.com/fuyi501/ailabel-me/blob/master/LICENSE)
