import * as http from 'http';
export const badRequest = (res: http.ServerResponse<http.IncomingMessage> & {
    req: http.IncomingMessage;}) =>  {
        res.statusCode = 404;
        res.end('Bad request');
}

export const checkId = (id: string) => {
const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
const str = "a24a6ea4-ce75-4665-a070-57453082c256";

const response = regexExp.test(id);
console.log(response)
}