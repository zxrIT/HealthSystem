import httpAxios from "../../http/HttpAxios.ts";

export function getChatIdsService<T>(signal?: AbortSignal): Promise<T> {
    return httpAxios.get<T, T>("/ai/chat/getChatIds", { signal }).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function getChatMessagesService<T>(chatId: string, prompt: string, signal?: AbortSignal): Promise<T> {
    return httpAxios.get<T, T>("/ai/chat/" + prompt + "/" + chatId, { signal }).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function getChatHistoryService<T>(chatId: string, signal?: AbortSignal): Promise<T> {
    return httpAxios.get<T, T>("/ai/chat/" + chatId, { signal }).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}

export function createChatIdService<T>(chatId: string, signal?: AbortSignal): Promise<T> {
    return httpAxios.post<T, T>("/ai/chat/create/" + chatId, {}, { signal }).then((response: T) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    })
}