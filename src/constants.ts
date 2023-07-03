// export type Routes = {
//     'api/user',

// }
import * as http from 'http';
export type Response = http.ServerResponse<http.IncomingMessage> & {
    req: http.IncomingMessage;}

    
export  type User =  {
    id: string,
    username: string,
    age: number,
    hobbies: string[],
}    

export  type UserForUpdated = Omit<User, 'id'>;

export const enum Method {
    GET = 'GET',
    PUT = 'PUT',
    DELETE = 'DELETE',
    POST = 'POST',
}