import {FC, ReactElement, useEffect, useState} from "react"
import faviconSvg from "../../assets/static/system/svg/favicon.svg"
import sunPng from "../../assets/static/system/icon/sun.png"
import darkPng from "../../assets/static/system/icon/night.png"
import wechatPng from "../../assets/static/system/icon/wechat.png"
import messagePng from "../../assets/static/system/icon/message.png"
import microblogPng from "../../assets/static/system/icon/microblog.png"
import wechatDarkPng from "../../assets/static/system/icon/weichat-dark.png"
import microblogDarkPng from "../../assets/static/system/icon/microblog-dark.png"
import englishPng from "../../assets/static/system/icon/english.png"
import englishDarkPng from "../../assets/static/system/icon/english-dark.png"
import chinesePng from "../../assets/static/system/icon/chinese.png"
import chineseDarkpng from "../../assets/static/system/icon/chinese-dark.png"
import classModule from "./Login.module.less"
import {Button} from 'antd';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {changeInternationalization, changeTopic} from "../../store/slice/topicSlice.ts";
import {LoginEnum} from "../../typing/enum";
import WeChatLogin from "./WechatLogin/WeChatLogin.tsx";
import {StepBackwardOutlined} from "@ant-design/icons"
import WeiboLogin from "./WeiboLogin/WeiboLogin.tsx";
import MessageLogin from "./MessageLogin/MessageLogin.tsx";
import UsernameLogin from "./UsernameLogin/UsernameLogin.tsx";
import {useTranslation} from "react-i18next";


const Login: FC = (): ReactElement => {
    const [t, i18n] = useTranslation();
    const topicSlice = useSelector((state: RootState) => state.topic);
    const [loginWay, setLoginWay] = useState<LoginEnum>(LoginEnum.Password)
    const dispatch = useDispatch();
    const [loginStatus, setLoginStatus] = useState<boolean>(false);

    useEffect(() => {
        i18n.changeLanguage(topicSlice.internationalization ? "en" : "zh")
    }, [topicSlice.internationalization])

    const switchLoginTitle = (): string => {
        switch (loginWay) {
            case LoginEnum.Message:
                return t("SMS login")
            case LoginEnum.Weibo:
                return t("micro-blog")
            case LoginEnum.Wechat:
                return t("Wechat login")
            default:
                return t("Password login")
        }
    }

    const switchLoginWay = (): ReactElement => {
        switch (loginWay) {
            case LoginEnum.Weibo:
                return <WeiboLogin/>
            case LoginEnum.Wechat:
                return <WeChatLogin/>
            case LoginEnum.Message:
                return <MessageLogin/>
            default:
                return <UsernameLogin status={loginStatus}/>
        }
    }

    return (
        <div className={classModule.loginContainer}>
            <div className={topicSlice.topic ? classModule.loginContextLight : classModule.loginContextDark}>
                <div className={classModule.loginTitle}>
                    <div className={classModule.titleIcon}>
                        <img src={faviconSvg} alt="Logo"/>
                    </div>
                    <div className={classModule.titleContent}>
                        {t("Health Consumption System")}
                    </div>
                    <div className={classModule.titleBtn}>
                        <div onClick={() => {
                            dispatch(changeTopic(!(topicSlice.topic)))
                        }}>
                            <img src={topicSlice.topic ? sunPng : darkPng} alt="Logo"/>
                        </div>
                        <div>
                            <img src={
                                topicSlice.topic ? (!topicSlice.internationalization ? chinesePng : englishPng)
                                    : (!topicSlice.internationalization ? chineseDarkpng : englishDarkPng)
                            } style={{marginTop: 20}} alt="Logo" onClick={
                                () => dispatch(changeInternationalization(!topicSlice.internationalization))
                            }/>
                        </div>
                    </div>
                </div>
                <div className={classModule.loginTopic}>
                    <div style={{display: LoginEnum.Password === loginWay ? "none" : ""}} onClick={() => {
                        setLoginWay(LoginEnum.Password)
                    }}>
                        <StepBackwardOutlined/>&nbsp;&nbsp;&nbsp;&nbsp;
                    </div>
                    {switchLoginTitle()}
                </div>
                <div
                    className={LoginEnum.Password === loginWay || LoginEnum.Message === loginWay
                        ? classModule.loginInput : classModule.loginInputChoice}>
                    {switchLoginWay()}
                </div>
                <div className={classModule.loginRemember}
                     style={{
                         display: LoginEnum.Password === loginWay || LoginEnum.Message === loginWay
                             ? "" : "none"
                     }}>
                    <div style={{display: "flex", flexDirection: "row", alignItems: "center", marginLeft: 20}}>
                        <div>
                            <input style={{
                                width: 20, height: 20
                            }} type="checkbox"/>
                        </div>
                        <div style={{marginLeft: 10}}>
                            <a href="javascript:;" style={{
                                color: topicSlice.topic ? "#333639" : "#fff"
                            }}>{t("Remember me")}</a>
                        </div>
                    </div>
                    <div style={{marginRight: 30}}>
                        <a href="javascript:;" style={{color: topicSlice.topic ? "#333639" : "#fff"}}>
                            {t("Forgot password")}？
                        </a>
                    </div>
                </div>
                <div className={classModule.loginButton}
                     style={{
                         display: LoginEnum.Password === loginWay || LoginEnum.Message === loginWay
                             ? "" : "none"
                     }}>
                    <Button style={{
                        width: 400, height: 40,
                        fontSize: 20, fontWeight: "bold", borderRadius: 40,
                        backgroundColor: "#636CFF"
                    }} type="primary"
                            block onClick={() => setLoginStatus(!loginStatus)}>{t("verify")}</Button>
                </div>
                <div className={classModule.loginOthers}>
                    <div>
                        {t("Login with other accounts")}
                    </div>
                    <div style={{marginTop: 10, marginLeft: 20}}>
                        <img src={messagePng} alt="Logo" onClick={() =>
                            setLoginWay(LoginEnum.Message)
                        }/>
                        <img src={topicSlice.topic ? wechatPng : wechatDarkPng} alt="Logo" onClick={() => {
                            setLoginWay(LoginEnum.Wechat)
                        }}/>
                        <img src={topicSlice.topic ? microblogPng : microblogDarkPng} alt="Logo" onClick={() => {
                            setLoginWay(LoginEnum.Weibo)
                        }}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login