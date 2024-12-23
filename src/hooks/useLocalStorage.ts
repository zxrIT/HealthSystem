import {IStorage} from "../typing/hooks/localStorage.ts";

export function useLocalStorage(): IStorage {
    const setStorage = (key: string, payload: string): void => {
        localStorage.setItem(key, payload)
    }
    const removeStorage = (key: string): void => {
        localStorage.removeItem(key)
    }
    const getStorage = (key: string): string => {
        return localStorage.getItem(key)!
    }
    return {setStorage, getStorage, removeStorage}
}