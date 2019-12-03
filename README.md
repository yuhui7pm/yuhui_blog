# 个人博客前后端搭建
## 步骤  
0. 配置mysql服务器，用于存储个人博客的数据。
1. 配置redis服务器环境，IP地址127.0.0.1:6379。启动redis.server.exe和redis.cli.exe。用于缓存用户名，账号和密码。
2. 在nginx.conf文件里配置nginx代理服务器，将前端服务器，后端服务器，图片服务器最终都指向同一个ip地址。事后启动nginx.exe。
3. 使用vscode调用http-server命令启动端口为8001的前端服务器
4. 使用vscode调用npm run dev启动端口号为8002的node服务器
5. 浏览器访问localhost:80/index.html可进入博客首页
![image]("https://github.com/yuhui7pm/yuhui_blog/yuhui_test/screenshot_pic/blog.png")
