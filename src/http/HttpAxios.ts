import axios, {AxiosInstance, AxiosResponse, CreateAxiosDefaults, InternalAxiosRequestConfig} from "axios"
import {useLocalStorage} from "../hooks/useLocalStorage.ts";

const httpAxios: AxiosInstance = axios.create({
    baseURL: "http://localhost:10000",
    timeout: 5000
} as CreateAxiosDefaults)

httpAxios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const {getStorage} = useLocalStorage()
    config.headers["Content-Type"] = "application/json;charset=UTF-8"
    config.headers["Authorization"] = JSON.parse(getStorage("authentication"))
    return config
}, (error: any) => {
    Promise.reject(error)
})

httpAxios.interceptors.response.use((response: AxiosResponse) => {
    return response.data
}, (error: any) => {
    Promise.reject(error)
})


export default httpAxios

