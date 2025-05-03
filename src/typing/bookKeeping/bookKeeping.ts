export interface IBookingBookKeeping {
    id: string
    transactionClassification: string
    counterparty: string
    productDescription: string
    directionOfTrade: number
    amountOfTransaction: number
    modeOfTransaction: string
    transactionStatus: string
    tradeOrderNumber: string
    remarks: string
    tradingHours: string
}

export interface IBookingBookKeepingDisplay {
    key: string
    tradeOrderNumber: string
    transactionClassification: string
    productDescription: string
    amountOfTransaction: number
    modeOfTransaction: string
}

export interface ISurplus {
    userId: string
    income: number
    disburse: number
    surplus: number
}

export interface IUploadTime {
    userId: string
    alipay: string,
    wechat: string
}