# 个人博客前后端搭建
## 文件说明
blogImage文件夹是与博客相关的图片。比如：博文相关的图片，用户的头像等。  
myBlog文件夹为前端相关文件。  
myBlogNode文件夹里的为node后端服务器文件。  
myBlog_compress为压缩过的前端文件，暂时没有用处。  
screen_pic文件夹为.readMe文件中使用的图片。  
## 步骤  
0. 配置mysql服务器，用于存储个人博客的数据。
1. 配置redis服务器环境，IP地址127.0.0.1:6379。启动redis.server.exe和redis.cli.exe。用于缓存用户名，账号和密码。
2. 在nginx.conf文件里配置nginx代理服务器，将前端服务器，后端服务器，图片服务器最终都指向同一个ip地址。事后启动nginx.exe。
3. 使用vscode调用http-server命令启动端口为8001的前端服务器
4. 使用vscode调用npm run dev启动端口号为8002的node服务器
5. 浏览器访问localhost:80/index.html可进入博客首页  
<div align="center"><img src="https://github.com/yuhui7pm/yuhui_blog/blob/yuhui_test/screenshot_pic/blog.png" alt="个人博客首页" width="70%"/></div>
