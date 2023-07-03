import * as http from 'http';
import url from 'url';
import cluster from 'cluster';
import { users } from './data/db';
import { addUser, handleGetUsers, handleUpdateUsers, handleGetUser, handleDeleteUser } from './request';
import dotenv from 'dotenv';
import { Method, UserForUpdated } from './constants';
import { badRequest, checkId, checkResponseBody } from './utils';
import { availableParallelism } from 'os';
dotenv.config();

const numCPUs = (availableParallelism()) - 1;
const PORT = process.env.PORT || 3000;
const hostname = '127.0.0.1';
const port = PORT;

export const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
});


process.on('uncaughtException', function (err) {
  console.log(err);
});

server.on('request', (req: http.IncomingMessage, res) => { 
  const { method, url: reqUrl } = req;
  const parsedUrl = url.parse(reqUrl, true);
  const { pathname } = parsedUrl;

  res.setHeader('Content-Type', 'application/json');
  let body = '';
  req.on('data', async (chunk) => {
    body +=chunk.toString()
  })
  if(pathname === '/api/users') {
    if (method === Method.GET) {
          handleGetUsers(res);
    } else if(method === Method.POST) {
      req.on('end', async () => {
        if(body.length < 1) {
          badRequest(res);
          return; 
        };
        await addUser(body, res);
      }).on("error", (error) => {
        res.statusCode = 500;
        res.end("Something went wrong");
      })
    }
  } else if(pathname.split('/').length === 4 && pathname.split('/').slice(0,3).join('/') == '/api/users') {
    if(method === Method.POST) {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: 'Route not found' }));
    }
    const id = pathname.split('/')[3];
    const isIdCorrectUUID = checkId(id);
    if(!isIdCorrectUUID) {
      badRequest(res);
      return;
    }
    if(method === Method.GET) {
      req.on('end', () => {
        handleGetUser(id, res);    
      });
    }
    if(method === Method.PUT) {
      req.on('end', () => {
        const parsedBody: UserForUpdated = JSON.parse(body);
        if (!checkResponseBody(parsedBody)) {
          badRequest(res, 'request is not correct');
          return;
        }
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
