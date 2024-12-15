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