const http = require('http');
const { Readable } = require('stream');
const fs = require('fs');

const content = fs.readFileSync('./asset/data.txt').toString();
const contentLen = content.length;


class ContentStream extends Readable {
  constructor(maxChunkNum) {
    super();
    this.skipLen = 0;
    this.count = 0;
    this.maxChunkNum = maxChunkNum || 0;
  }

  _read() {
    let skipLen = 0;
    setTimeout(() => {
      this.count += 1;
      let chunkLen = parseInt(Math.random() * 10, 10) + 1;
      const chunk = content.substr(this.skipLen, chunkLen);
      this.skipLen += chunkLen;
      this.push(chunk);

      const isEnd = (this.maxChunkNum && this.maxChunkNum <= this.count) || this.skipLen >= contentLen;

      if (isEnd) {
        this.push(null);
      }
    }, parseInt(Math.random() * 300, 10) + 1);
  }
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = '';
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const params = JSON.parse(body);
      console.info(params);
      if (params.useStream) {
        const contentStream = new ContentStream(params.maxChunkNum);
        contentStream.pipe(res);
      } else {
        res.end(content);
      }
    });
  } else if (req.method === 'GET') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(fs.readFileSync('./asset/index.html'));
  } else {
    res.statusCode = 405; // Method Not Allowed
    res.end();
  }
});


const port = process.argv[2] ? parseInt(process.argv[2], 10) : 3000;
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});