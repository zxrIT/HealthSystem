import httpAxios from "../../http/HttpAxios.ts";

export function incrementTodoService<T, R>(todo: R): Promise<T> {
    return httpAxios.post<T, T, R>("/todo/increment", todo).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function getTodoService<T>(): Promise<T> {
    return httpAxios.get<T, T>("/todo/getTodoList").then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function sendEmailService<T>(email: string, content: string): Promise<T> {
    return httpAxios.get<T, T>(`/todo/send/todo/email/${email}/${content}`).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}