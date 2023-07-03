import * as http from 'http';
import { UserForUpdated } from './constants';

export const badRequest = (res: http.ServerResponse<http.IncomingMessage> & {
    req: http.IncomingMessage;}) =>  {
        res.statusCode = 400;
        res.end('Bad request');
        return;
}

export const checkId = (id: string) => {
const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
const str = "a24a6ea4-ce75-4665-a070-57453082c256";

const response = regexExp.test(id);
console.log(response)
return response;
}

export const checkResponseBody = (body: UserForUpdated) => {
    return (
        body &&
        !!body.username &&
        typeof body.username === "string" &&
        body.age !== undefined &&
        typeof body.age === "number" &&
        Array.isArray(body.hobbies) &&
        (!body.hobbies.length || body.hobbies.every((h) => typeof h === "string"))
      );
}