import {useLocation} from "react-router-dom";
import {useLocalStorage} from "../hooks/useLocalStorage.ts";
import type {Location} from "react-router-dom";
import {ReactElement} from "react";
import {message} from "antd";
import {IUser} from "../typing/user/user.ts";
import Login from "../view/login/Login.tsx";

const WithAuthenticationHocComponent = (props: { children: ReactElement }): ReactElement => {
    const location: Location = useLocation();
    const {getStorage} = useLocalStorage()
    const token: string = JSON.parse(getStorage("authentication"))
    const user: IUser = JSON.parse(getStorage("user"))
    if (token == null || user == null) {
        message.error("您还没有登录请先登录后再进行使用")
        return <Login/>
    }
    if (location.pathname === "/") {
        return props.children
    }
    return props.children
}

export default WithAuthenticationHocComponent