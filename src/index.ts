import * as http from 'http';
import url from 'url';
import cluster from 'cluster';
import { users } from './data/db';
import { addUser, handleGetUsers, handleUpdateUsers, handleGetUser, handleDeleteUser } from './request';
import dotenv from 'dotenv';
import { Method } from './constants';
import { badRequest, checkId, checkResponseBody } from './utils';
import { availableParallelism } from 'os';
dotenv.config();

const numCPUs = (availableParallelism()) - 1;
const PORT = process.env.PORT || 3000;
const hostname = '127.0.0.1';
const port = PORT;
// let server;
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
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
          handleGetUsers(res);
    } else if(method === Method.POST) {
      const body = [];
      req.on('data', async (chunk) => {
        body.push(chunk);
      }).on('end', async () => {
        const parsedBody = Buffer.concat(body).toString();
        if(body.length < 1) {
          badRequest(res);
          return; 
        };
        await addUser(parsedBody, res);
      }).on("error", (error) => {
        res.statusCode = 500;
        res.end("Something went wrong");
      })
    }
  } else if(pathname.split('/').length === 4 && pathname.split('/').slice(0,3).join('/') == '/api/users') {
    const id = pathname.split('/')[3];
    const isIdCorrectUUID = checkId(id);
    if(!isIdCorrectUUID) {
      badRequest(res);
    }
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
        const b = JSON.stringify(Buffer.concat(body).toString()); 
        const parsedBody = JSON.parse(b);
        if (!checkResponseBody(parsedBody)) badRequest(res);
        handleUpdateUsers(parsedBody, id, res);
      });
      
    }
    if(method === Method.DELETE) {
      handleDeleteUser(id, res);     
    }
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
}).on('error', (error) => {
  console.error(error);
})

server.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});



// if (cluster.isPrimary) {
//   console.log(`Master ${process.pid} is running`);
//   console.log(numCPUs)
//   // Fork workers.
//   for (let i = 0; i < numCPUs; i++) {
//     // console.log('sd')
//     cluster.fork({port: (+port)+i});
//   }
//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`worker ${worker.process.pid} died`);
//   });

// } else {
//   http.createServer((req, res) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'application/json');
//   });
//   server.listen(PORT, () => {
//       console.log("Error in server setup") 
//       console.log(`Worker ${process.pid} started`);
//       console.log(`Server running at http://${hostname}:${port}/`);
//   });

// }
