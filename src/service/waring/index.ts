import httpAxios from "../../http/HttpAxios.ts";

export function changeSalaryService<T>(salary: number): Promise<T> {
    return httpAxios.post<T, T>("/computed/setUserSalary/" + salary).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function changeThresholdService<T>(Threshold: number): Promise<T> {
    return httpAxios.post<T, T>("/computed/serUserThreshold/" + Threshold).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function sendMessageService<T>(): Promise<T> {
    return httpAxios.get<T, T>("/computed/sendMessage/").then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function getUserService<T>(): Promise<T> {
    return httpAxios.get<T, T>("/computed/getUser/").then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}