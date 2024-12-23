export interface IStorage {
    setStorage: (key: string, payload: string) => void
    removeStorage: (key: string) => void
    getStorage: (key: string) => string
}

