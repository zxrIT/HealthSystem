import httpAxios from "../../http/HttpAxios.ts";

export function getBookKeepingService<T>(page: number, quantity: number): Promise<T> {
    return httpAxios.get<T, T>("/book/keeping/getBookKeeping/" + page + "/" + quantity).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function createBookKeepingService<T, R>(bookKeeping: R): Promise<T> {
    return httpAxios.post<T, T, R>("/book/keeping/createBookKeeping/", bookKeeping).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function updateBookKeepingService<T, R>(bookKeeping: R): Promise<T> {
    return httpAxios.put<T, T, R>("/book/keeping/updateBookKeeping/", bookKeeping).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function deleteBookKeepingService<T>(id: string): Promise<T> {
    return httpAxios.delete<T, T>("/book/keeping/deleteBookKeeping/" + id).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}