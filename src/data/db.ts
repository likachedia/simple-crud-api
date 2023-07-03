import { User } from "../constants";

export const users = [];


export const add = (user: User) => {
    users.push(user);
    console.log(users);
}

export const getAllUser = (): User[] => {
    return users;
}

export const deleteUser = (id: string) => {
    const index = users.findIndex((user) => user.id === id);
    users.splice(index, 1);
}

export const updateUser = (body, index) => {
    // const index = users.findIndex((user) => user.id === id);
    // if(index) {
        users[index] = { ...users[index], ...body };
        console.log(users[index]);
    // } 
}

export const getUser = (id: string): User | string => {
    const index = users.findIndex((user) => user.id === id);
    if(index) {
        return users[index];
    } 
}