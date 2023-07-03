import * as http from 'http';
import { add, getAllUser, deleteUser, updateUser, getUser } from './data/db';
import { v4 as uuidv4 } from 'uuid';
import { Response } from './constants';

export const addUser = async (user, res: Response) => {
    try {
        const newuser = JSON.parse(user);
        newuser.id = uuidv4();
        add(newuser);
        res.statusCode = 201;
        res.end('User created succesfully');
    } catch {
        res.statusCode = 500;
        res.end('Something went wrong');
    }
}
export const handleDeleteUser = async (id: string, res: Response) => {
    const users = getAllUser();
    const index = users.findIndex((user) => user.id === id);
    console.log(index);
    if(index !== -1) {
        deleteUser(id);
        res.statusCode = 204;
        res.end();
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: 'user not found' }));
    }
}


export const handleGetUsers = (res: Response) => {
    const users = getAllUser();
    res.statusCode = 200;
    res.write(JSON.stringify(users));
    res.end();
    // return JSON.stringify(users);
}

export const handleUpdateUsers = (user, id: string, res: Response) => {
    console.log(user, id);
    const users = getAllUser();
    // const parsedBody = JSON.parse(Buffer.concat(user).toString());
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
        updateUser({...user, id: id}, id);
        res.statusCode = 200;
        res.write(JSON.stringify(user));
        res.end();
        // return {
        //     statusCode: 200,
        //     updatedUser: JSON.stringify(user),
        //     message: 'User updated succesfully',
        // }
    } else {
        res.statusCode = 404;
        res.end('User not found');
        // return {
        //     statusCode: 404,
        //     message: 'User not found',
        // }
    }
}

export const handleGetUser = (id: string) => {
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