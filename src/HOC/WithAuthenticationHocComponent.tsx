import {useLocation} from "react-router-dom";
import {useLocalStorage} from "../hooks/useLocalStorage.ts";
import type {Location} from "react-router-dom";
import {ReactElement} from "react";
import {message} from "antd";
import {IUser} from "../typing/user/user.ts";
import Forbidden from "../error/403";
import {useDispatch} from "react-redux";
import {changeInternationalization, changeTopic} from "../store/slice/topicSlice.ts";
import {verificationTokenService} from "../service/loginService";
import {BaseResponse} from "../typing/response/baseResponse.ts";
import {initUser} from "../store/slice/UserSlice.ts";

const WithAuthenticationHocComponent = (props: { children: ReactElement }): ReactElement => {
    const location: Location = useLocation();
    const dispatch = useDispatch()
    const {getStorage} = useLocalStorage()
    const token: string = JSON.parse(getStorage("authentication"))
    const user: IUser = JSON.parse(getStorage("user"))
    const topic: boolean = JSON.parse(getStorage("topic"))
    const internationalization: boolean = JSON.parse(getStorage("internationalization"))
    if (topic !== void 0) {
        dispatch(changeTopic(topic))
    }
    if (internationalization !== void 0) {
        dispatch(changeInternationalization(internationalization))
    }
    if (location.pathname === "/" || location.pathname === "/403" || location.pathname === "/500") {
        return props.children
    }
    if (token === void 0 || user === void 0 || token === null || user === null) {
        message.error("您还没有登录请先登录后再进行使用")
        return <Forbidden/>
    }
    verificationTokenService<BaseResponse<boolean>, string>(user.id, token).then((response) => {
        if (!response.data) {
            return <Forbidden/>
        }
    })
    dispatch(initUser(user))
    return props.children
}

export default WithAuthenticationHocComponent