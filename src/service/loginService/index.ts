import httpAxios from "../../http/HttpAxios.ts";

export function passwordLoginService<T, R>(user: R): Promise<T> {
    return httpAxios.post<T, T, R>("/authentication/password/login", user).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function logoutService<T, R>(userId: R): Promise<T> {
    return httpAxios.post<T, T, R>("/authentication/logout/" + userId).then((response: T) => {
        return response;
    }, error => {
        return Promise.reject(error);
    })
}

export function verificationTokenService<T, R>(userId: R, token: R): Promise<T> {
    return httpAxios.post<T, T, R>(`/authentication/verification/${userId}/${token}`).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}