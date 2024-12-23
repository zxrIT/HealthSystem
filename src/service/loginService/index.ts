import httpAxios from "../../http/HttpAxios.ts";

export function passwordLoginService<T, R>(user: R): Promise<T> {
    return httpAxios.post<T, T, R>("authentication/password/login", user).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}