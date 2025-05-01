import httpAxios from "../../http/HttpAxios.ts";

export function getChatIdsService<T>(): Promise<T> {
    return httpAxios.get<T, T>("/ai/chat/getChatIds").then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function getChatMessagesService<T>(chatId: string, prompt: string): Promise<T> {
    return httpAxios.get<T, T>("/ai/chat/" + prompt + "/" + chatId).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function getChatHistoryService<T>(chatId: string): Promise<T> {
    return httpAxios.get<T, T>("/ai/chat/" + chatId).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function createChatIdService<T>(chatId: string): Promise<T> {
    return httpAxios.post<T, T>("/ai/chat/create/" + chatId).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}