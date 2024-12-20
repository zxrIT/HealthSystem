export interface IBookKeepingResponse<T> {
    records: T
    total: number
    size: number
    current: number
    orders: T
    optimizeCountSql: boolean
    searchCount: boolean
    optimizeJoinOfCountSql: boolean
}

export interface IUploadResult {
    uploadId: string
    uploadMessage: string
}