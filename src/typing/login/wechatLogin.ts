import {IUser} from "../user/user.ts";

export interface IWechatLoginMessage {
    loginId: string
    scanStatus: boolean
    wechatLoginUserResponse?: IUser
}