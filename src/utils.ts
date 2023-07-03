import * as http from "http";
import { UserForUpdated } from "./constants";
import { version, validate } from "uuid";
export const badRequest = (
  res: http.ServerResponse<http.IncomingMessage> & {
    req: http.IncomingMessage;
  },
  mess?: string
) => {
  res.statusCode = 400;
  res.end(`Bad request ${mess}`);
  return;
};

export const checkId = (id: string) => {
  const response = validate(id) && version(id) === 4;
  return response;
};

export const checkResponseBody = (body: UserForUpdated) => {
  console.log(body);
  const response =
    body &&
    !!body.username &&
    typeof body.username === "string" &&
    body.age !== undefined &&
    typeof body.age === "number" &&
    Array.isArray(body.hobbies) &&
    (!body.hobbies.length || body.hobbies.every((h) => typeof h === "string"));

  console.log(response);
  return response;
};
