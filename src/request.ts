import * as http from 'http';
import { add, getAllUser, deleteUser, updateUser, getUser } from './data/db';
import { v4 as uuidv4 } from 'uuid';
import { Response } from './constants';

export const addUser = async (user, res: Response) => {
    const parsedBody = Buffer.concat(user).toString();
    const newuser = JSON.parse(parsedBody);
    newuser.id = uuidv4();
    add(newuser);
    res.statusCode = 201;
    res.end('User created succesfully');
}

export const handleGetUsers = (res: Response) => {
    const users = getAllUser();
    res.statusCode = 200;
    res.write(users);
    res.end();
    // return JSON.stringify(users);
}

export const handleUpdateUsers = (user, id: string) => {
    const users = getAllUser();
    const parsedBody = JSON.parse((Buffer.concat(user)).toString());
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
        updateUser({...parsedBody, id: id}, id);
        return {
            statusCode: 200,
            updatedUser: JSON.stringify(parsedBody),
            message: 'User updated succesfully',
        }
    } else {
        return {
            statusCode: 404,
            message: 'User not found',
        }
    }

    // res.statusCode = response.statusCode;
    // if(response.user) {
    //   res.write(response.user);
    //   res.end();
    // } else {
    //   res.end(response.message);
    // }
}

export const handleGetUser = (id) => {
    const users = getAllUser();
    const index = users.findIndex((user) => user.id === id);
    console.log(index);
    if(index !== -1) {
        return {
            statusCode: 200,
            user: JSON.stringify(users[index]),
        }
    } else {
        return {
            statusCode: 404,
            message: 'User not found',
        }
    }
}
// export const request = (
//     req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage> & {
//     req: http.IncomingMessage;
// }) => {

// }

// const req = http.request(
//     {host: ''},
//     (response) => {
//         response.on('data', (chunk) => {

//         })
//     }
// )