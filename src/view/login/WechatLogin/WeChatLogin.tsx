import {FC, ReactElement, useEffect, useState} from "react"
import wechatLoginStyle from "./WeChatLogin.module.less"
import {CheckCircleTwoTone} from "@ant-design/icons";
import {message} from "antd";
import {nanoid} from "@reduxjs/toolkit";
import {IWechatLoginMessage} from "../../../typing/login/wechatLogin.ts";
import {useDispatch, useSelector} from "react-redux";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {initUser} from "../../../store/slice/UserSlice.ts";
import {useLocalStorage} from "../../../hooks/useLocalStorage.ts";
import {useTranslation} from "react-i18next";
import {RootState} from "../../../store";

const WeChatLogin: FC = (): ReactElement => {
    const dispatch = useDispatch()
    const [loginStatus, setLoginStatus] = useState<boolean>(false)
    const navigateFunction: NavigateFunction = useNavigate();
    const [imageUrl, setImageUrl] = useState<string>()
    const [loginId, _] = useState<string>(() => nanoid())
    const [scanCodeStatus, setScanCodeStatus] = useState<boolean>(false);
    const [webSocketStatus, setWebSocketStatus] = useState<boolean>(false);
    const {setStorage} = useLocalStorage()
    const [t, i18n] = useTranslation();
    const topicSlice = useSelector((state: RootState) => state.topic);

    useEffect(() => {
        i18n.changeLanguage(topicSlice.internationalization ? "en" : "zh")
    }, [topicSlice.internationalization])

    useEffect(() => {
        if (typeof (WebSocket) === "undefined") {
            message.error(t("Your browser version is too low. Please use a new version of your browser"))
        }
    }, []);
    useEffect(() => {
        fetch(import.meta.env.VITE_WECHAT_LOGIN_URL + loginId)
            .then(response => response.blob())
            .then(blob => {
                const objectURL: string = URL.createObjectURL(blob);
                setImageUrl(objectURL);
                setWebSocketStatus(true);
            })
    }, [])
    useEffect(() => {
        if (!webSocketStatus) return;
        setWebSocketStatus(true);
        const webSocket = new WebSocket(import.meta.env.VITE_WECHAT_LOGIN_STATUS_WEBSOCKET_URL + loginId)
        webSocket.onopen = () => {
            console.log("websocket open");
        }
        webSocket.onmessage = event => {
            console.log(event.data);
            const messageData: IWechatLoginMessage = JSON.parse(event.data);
            if (messageData.wechatLoginUserResponse === undefined) {
                if (messageData.loginId === loginId && messageData.scanStatus) {
                    setScanCodeStatus(true);
                }
                return;
            } else {
                message.success(t("Login successful"))
                dispatch(initUser(messageData.wechatLoginUserResponse))
                setStorage("user", JSON.stringify(messageData.wechatLoginUserResponse))
                setStorage("authentication", JSON.stringify(messageData.wechatLoginUserResponse.token))
                setLoginStatus(true);
                navigateFunction("/home")
                webSocket.close();
            }
        }
        const timerOut = setTimeout(() => {
            if (!loginStatus) {
                message.error(t("Login failed. Please try again later"))
            }
            webSocket.close()
            console.log("websocket close");
        }, 30000)

        return () => {
            webSocket.close()
            clearTimeout(timerOut)
            console.log("websocket close");
        }
    }, [webSocketStatus]);
    return (
        <div className={wechatLoginStyle.wechatLoginBox}>
            <div className={wechatLoginStyle.wechatLoginImg}>
                <img src={imageUrl} alt="微信登录二维码"/>
            </div>
            <div className={wechatLoginStyle.wechatLoginSuccess}>
                <CheckCircleTwoTone style={{display: !scanCodeStatus ? "none" : ""}} twoToneColor="#26C445"/>
                <text
                    style={{
                        color: "#26C445",
                        marginLeft: 5,
                        display: !scanCodeStatus ? "none" : "",
                    }}>{t("Please confirm login on the mobile terminal if the code is scanned successfully")}
                </text>
                <text
                    style={{
                        color: "#636CFF", marginLeft: 5, display: scanCodeStatus ? "none" : ""
                    }}>{t("Please scan the code on wechat to log in")}
                </text>
            </div>
        </div>
    )
}

export default WeChatLogin;