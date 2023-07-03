import { User } from "../constants";

export const users = [];


export const add = (user: User) => {
    users.push(user);
}

export const getAllUser = (): User[] => {
    return users;
}

export const deleteUser = (id: string) => {
    const index = users.findIndex((user) => user.id === id);
    users.splice(index, 1);
}

export const updateUser = (body: User, index: number) => {
    users[index] = { ...users[index], ...body };
}

export const getUser = (id: string): User => {
    const index = users.findIndex((user) => user.id === id);
    if(index) {
        return users[index];
    } 
}