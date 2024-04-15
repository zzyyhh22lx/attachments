const Koa = require('koa');
const { koaBody } = require('koa-body');
const Router = require('koa-router');
const static = require('koa-static');
const fs = require('fs-extra');
const app = new Koa();
const router = new Router();

// 大文件上传

const UPLOAD_DIR = 'uploads'; // 上传文件保存路径
// 静态文件中间件，提供临时文件的访问路径
app.use(static(UPLOAD_DIR));
const MAX_SIZE = 100 * 1024 * 1024; // 最大上传文件大小为100MB
// 跨域
app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // 令牌
    ctx.set('Access-Control-Allow-Credentials', true);
    // 处理预检请求
    if (ctx.method === 'OPTIONS') {
      return ctx.status = 204;
    }
    await next();
})

// 创建临时文件夹
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}
router.get('/', (ctx) => {
  ctx.body = {code: 200};
})
// 处理上传请求
router.post('/upload', async (ctx) => {
  const { chunkIndex, fileHash } = ctx.request.body;
  const chunkDir = `${UPLOAD_DIR}/${fileHash}`; // 保存该文件块的目录
  const chunkPath = `${chunkDir}/files${chunkIndex}`; // 保存该文件块的路径
  const file = ctx.request.files.file; // 获取上传的文件块
  // 校验文件块大小是否超过限制
  if (file.size > MAX_SIZE) {
    ctx.body = { code: 413, msg: '文件块大小超过限制' };
    return;
  }
  // 将文件块保存到临时文件夹
  if (!fs.existsSync(chunkDir)) {
    fs.mkdirSync(chunkDir);
  }
  const reader = fs.createReadStream(file.filepath);
  const writer = fs.createWriteStream(chunkPath);
  const result = reader.pipe(writer);
  //  await fs.move(file.filepath, chunkPath);
  await getResponse();
  ctx.body = { code: 201, msg: '文件块上传成功' };
  function getResponse() {
    return new Promise((resolve, reject) => {
        result.on('finish', () => {
            resolve()
        });
    })
  }
});

// 合并文件块为完整文件
router.post('/merge', async (ctx) => {
  const { filename, fileHash } = ctx.request.body;
  const filePath = `${UPLOAD_DIR}/${filename}`; // 保存完整文件的路径
  const chunkDir = `${UPLOAD_DIR}/${fileHash}`;
  // 获取所有文件块并按照顺序排序
  let chunks = await fs.readdir(chunkDir);
  console.log(chunks); // 得到fileName[]字符串数组
  chunks.sort((a, b) => parseInt(a) - parseInt(b));

  // 将所有文件块合并为完整文件
  await Promise.all(
    chunks.map((chunkPath, index) =>
      fs.appendFile(filePath, fs.readFileSync(`${chunkDir}/${chunkPath}`))
    )
  );
  // 删除临时文件夹
  await fs.remove(chunkDir);

  ctx.body = { code: 201, msg: '文件合并成功' };
});

// 请求体解析中间件
app.use(koaBody({
    multipart: true,
    formidable: {
      maxFileSize: 100 * 1024 * 1024,  // 设置上传文件大小上限，默认为 2MB
    },
}));

// 路由中间件
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});
