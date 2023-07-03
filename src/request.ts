import { add, getAllUser, deleteUser, updateUser, getUser } from './data/db';
import { v4 as uuidv4 } from 'uuid';
import { Response } from './constants';

export const addUser = async (user: string, res: Response) => {
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
export const handleDeleteUser = (id: string, res: Response) => {
    const users = getAllUser();
    const index = users.findIndex((user) => user.id === id);
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
}

export const handleUpdateUsers = async (user, id: string, res: Response) => {
    const users = getAllUser();
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
        updateUser({...user, id: id}, index);
        res.statusCode = 200;
        res.write(JSON.stringify(user));
        res.end();
    } else {
        res.statusCode = 404;
        res.end('User not found');
    }
}

export const handleGetUser = async (id: string, res:Response) => {
    const users = getAllUser();
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
        res.statusCode = 200;
        res.write(JSON.stringify(users[index]));
        res.end();
    } else {
        res.statusCode = 404;
        res.end('User not found');
    }
}