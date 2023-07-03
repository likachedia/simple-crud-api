import supertest from "supertest";
import { server } from "./index";

describe("Server", function () {
  const request = supertest.agent(server);

  afterAll((done) => {
    server.close(done);
  });

  it("should get users array", async () => {
    const res = await request.get("/api/users");
    expect(res.status).toBe(200)
    expect(res.body).toEqual([]);
  });

  it("should get /api", async () => {
    const res = await request.get("/api");
    expect(res.status).toBe(404);
  });

  it("should post /api", async () => {
    const user = {
        "username": "lika",
        "age": 21,
        "hobbies": ["dsf"]
    }
    const res = await request.post("/api/users").send(user);
    expect(res.status).toBe(201);
  });
});