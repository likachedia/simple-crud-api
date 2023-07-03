// const http = require('http');
import * as http from 'http';
import url from 'url';
import { users } from './data/db';
import { addUser, handleGetUsers, handleUpdateUsers, handleGetUser } from './request';
import dotenv from 'dotenv';
import { Method } from './constants';
import { badRequest } from './utils';

dotenv.config();

const PORT = process.env.PORT || 3000;
console.log(PORT);
const hostname = '127.0.0.1';
const port = PORT;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
});
process.on('uncaughtException', function (err) {
  console.log(err);
});

server.on('request', (req: http.IncomingMessage, res) => { 
  const { method, url: reqUrl, headers } = req;
  const parsedUrl = url.parse(reqUrl, true);
  const { pathname, query } = parsedUrl;

  res.setHeader('Content-Type', 'application/json');
  console.log(pathname.split('/').slice(0,3).join('/'));
  if(pathname === '/api/users') {
    if (method === Method.GET) {
          const users = handleGetUsers(res);
          res.statusCode = 200;
          res.write(users);
          res.end();
    } else if(method === Method.POST) {
      const body = [];
      req.on('data', (chunk) => {
        body.push(chunk);
      }).on('end', async () => {
        if(body.length < 1) {
          badRequest(res);
          return; 
        };
        await addUser(body, res);
        res.statusCode = 201;
        res.end('User created succesfully');
      })
    }
  } else if(pathname.split('/').length === 4 && pathname.split('/').slice(0,3).join('/') == '/api/users') {
    const id = pathname.split('/')[3];
    if(method === Method.GET) {
      const body = [];
      req.on('data', (chunk) => {
        body.push(chunk);
      })
      req.on('end', () => {
        const response = handleGetUser(id);
        res.statusCode = response.statusCode;
        if(response.user) {
          res.write(response.user);
          res.end();
        } else {
          res.end(response.message);
        }
        
      });
    }
    if(method === Method.PUT) {
      const body = [];
      req.on('data', (chunk) => {
        body.push(chunk);
      })
      req.on('end', () => {
        const response = handleUpdateUsers(body, id);
        res.statusCode = response.statusCode;
        if(response.updatedUser) {
          res.write(response.updatedUser);
          res.end();
        } else {
          res.end(response.message);
        }
      });
      
    }
    if(method === Method.DELETE) {}
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: 'Route not found' }));
  }


  // if (method === 'GET' && pathname === '/api/users') {
  //   const users = handleGetUsers();
  //   res.statusCode = 200;
  //   res.write(users);
  //   res.end();
  // } else if (method === 'GET' && pathname === '/api/users/:id') {
  //   const id = parsedUrl.pathname.split('/')[2];
  //   const user = users.find((user) => user.id === parseInt(id));
  //   if (user) {
  //     res.statusCode = 200;
  //     res.end(JSON.stringify(user));
  //   } else {
  //     res.statusCode = 404;
  //     res.end(JSON.stringify({ message: 'user not found' }));
  //   }
  // } else if (method === 'POST' && pathname === '/api/users') {

  //   const body = [];
  //   req.on('data', (chunk) => {
  //     body.push(chunk);
  //   }).on('end', () => {
  //     addUser(body);
  //     res.statusCode = 201;
  //     res.end('User created succesfully');
  //   })


  // } else if (method === 'PUT' && pathname === '/api/users/:id') {
  //   const id = parsedUrl.pathname.split('/')[2];
  //   const body = [];
  //   req.on('data', (chunk) => {
  //     body.push(chunk);
  //   })
  //   req.on('end', () => {

  //   });
  // } else if (method === Method.DELETE && pathname === '/users/:id') {
  //   // Delete a user by ID
  //   const id = parsedUrl.pathname.split('/')[2];
  //   const index = users.findIndex((user) => user.id === parseInt(id));
  //   if (index !== -1) {
  //     const deleteduser = users.splice(index, 1)[0];
  //     res.statusCode = 200;
  //     res.end(JSON.stringify(deleteduser));
  //   } else {
  //     res.statusCode = 404;
  //     res.end(JSON.stringify({ message: 'user not found' }));
  //   }
  // } else {
  //   res.statusCode = 404;
  //   res.end(JSON.stringify({ message: 'Route not found' }));
  // }









  // if(query.method == 'GET' && pathname == '/api/user') {
  //   const body = [];
  //   req.on('data', (chunk) => {
  //     body.push(chunk);
  //   }).on('end', () => {
  //     const parsedBody = JSON.parse((Buffer.concat(body)).toString());
  //   }).on('error', (err: Error) => {
  //     res.writeHead(404, {
  //       'Content-type': 'text/html',
  //       'X-Powered-by': 'node'
  //     });
  //     res.end('Page not found');
  //   })

  // } else {

  // }
})
// server.on('request' (req, res) => {
  
// });

server.listen(port, () => {
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