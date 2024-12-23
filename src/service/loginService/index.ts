import axios from "axios";

export function passwordLoginService<T, R>(user: R): Promise<T> {
    return axios.post<T, T, R>("http://localhost:8888/authentication/password/login", user).then((response: T) => {
        return ((response as any).data) as T;
    }, (error) => {
        return Promise.reject(error);
    })
}