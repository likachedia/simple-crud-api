import * as http from "http";
import url from "url";
import {
  addUser,
  handleGetUsers,
  handleUpdateUsers,
  handleGetUser,
  handleDeleteUser,
} from "./request";
import dotenv from "dotenv";
import { Method, UserForUpdated } from "./constants";
import { badRequest, checkId, checkResponseBody } from "./utils";
import { availableParallelism } from "os";
dotenv.config();

const hostname = "127.0.0.1";
const port = process.env.PORT || 3000;

export const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
});

process.on("uncaughtException", function (err) {
  console.log(err);
});

server
  .on("request", (req: http.IncomingMessage, res) => {
    const { method, url: reqUrl } = req;
    const parsedUrl = url.parse(reqUrl, true);
    const { pathname } = parsedUrl;

    res.setHeader("Content-Type", "application/json");
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    if (pathname === "/api/users") {
      if (method === Method.GET) {
        try{
          handleGetUsers(res);
        }catch{
          res.statusCode = 500;
          res.end('Something went wrong');
        }
        
      } else if (method === Method.POST) {
        req
          .on("end", async () => {
            if (body.length < 1) {
              badRequest(res);
              return;
            }
            const parsedBody: UserForUpdated = JSON.parse(body);
            try{
              if (!checkResponseBody(parsedBody)) {
                badRequest(res, "request is not correct");
                return;
              }
              await addUser(body, res);
            }catch{
              res.statusCode = 500;
              res.end('Something went wrong');
            }
            
          })
          .on("error", (error) => {
            res.statusCode = 500;
            res.end("Something went wrong");
          });
      }
    } else if (
      pathname.split("/").length === 4 &&
      pathname.split("/").slice(0, 3).join("/") == "/api/users"
    ) {
      if (method === Method.POST) {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: "Route not found" }));
      }
      const id = pathname.split("/")[3];
      const isIdCorrectUUID = checkId(id);
      if (!isIdCorrectUUID) {
        badRequest(res);
        return;
      }
      if (method === Method.GET) {
        req.on("end", () => {         
          try{
            handleGetUser(id, res);
          }catch{
            res.statusCode = 500;
            res.end('Something went wrong');
          }
        });
      }
      if (method === Method.PUT) {
        req.on("end", async () => {
          const parsedBody: UserForUpdated = JSON.parse(body);
          if (!checkResponseBody(parsedBody)) {
            badRequest(res, "request is not correct");
            return;
          }
          try{
            await handleUpdateUsers(parsedBody, id, res);
          }catch{
            res.statusCode = 500;
            res.end('Something went wrong');
          }
          
        });
      }
      if (method === Method.DELETE) {
        try{
          handleDeleteUser(id, res);
        }catch{
          res.statusCode = 500;
          res.end('Something went wrong');
        }
        
        
      }
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: "Route not found" }));
    }
  })
  .on("error", (error) => {
    console.error(error);
  });

server.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
