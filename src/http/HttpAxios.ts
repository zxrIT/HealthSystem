import axios, {InternalAxiosRequestConfig, AxiosResponse, AxiosInstance, CreateAxiosDefaults} from "axios"

const httpAxios: AxiosInstance = axios.create({
    baseURL: "http://localhost:10000",
    timeout: 5000
} as CreateAxiosDefaults)

httpAxios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    config.headers["Content-Type"] = "application/json;charset=UTF-8"
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

