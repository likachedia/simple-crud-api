const http = require('http');
require('dotenv').config();

const PORT = process.env.PORT;
console.log(PORT);
const hostname = '127.0.0.1';
const port = PORT;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// import { createServer } from 'http';
// import { readFile } from 'fs/promises';
// import { resolve } from 'path';
// import * as http from 'http';
// const PORT = process.env.PORT;
// const server = createServer(async (req, res) => {
  // const publicPath = resolve(__dirname, 'public');
  // const filePath = resolve(publicPath, req.url.slice(1));
  // res.statusCode = 200;
  // res.setHeader('Content-Type', 'text/plain');
  // res.end('Hello World');
  // try {
  //   const data = await readFile(filePath);
  //   res.writeHead(200, { 'Content-Type': 'text/html' });
  //   res.end(data);
  // } catch (err) {
  //   res.writeHead(404, { 'Content-Type': 'text/plain' });
  //   res.end('Not found');
  // }
// });

// server.listen(PORT, () => {
//   console.log('Server is running on port 3000');
// });

// import http from "http";

// export const server = http.createServer((req, res) => {
//   res.writeHead(200, { "Content-Type": "application/json" });
//   res.end(
//     JSON.stringify({
//       data: "It Works!",
//     })
//   );
// });

// server.listen(3000, () => {
//   console.log("Server running on http://localhost:3000/");
// });