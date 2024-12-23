import {FC, ReactElement, useState} from "react"
import faviconSvg from "../../assets/static/system/svg/favicon.svg"
import sunPng from "../../assets/static/system/icon/sun.png"
import i18nLight from "../../assets/static/system/icon/i18n-light.png"
import wechatPng from "../../assets/static/system/icon/wechat.png"
import messagePng from "../../assets/static/system/icon/message.png"
import microblogPng from "../../assets/static/system/icon/microblog.png"
import classModule from "./Login.module.less"
import {Button} from 'antd';
import UsernameLogin from "./UsernameLogin/UsernameLogin.tsx";


const Login: FC = (): ReactElement => {
    const [loginStatus, setLoginStatus] = useState<boolean>(false);

    return (
        <div className={classModule.loginContainer}>
            <div className={classModule.loginContext}>
                <div className={classModule.loginTitle}>
                    <div className={classModule.titleIcon}>
                        <img src={faviconSvg} alt="Logo"/>
                    </div>
                    <div className={classModule.titleContent}>
                        健康消费系统
                    </div>
                    <div className={classModule.titleBtn}>
                        <div>
                            <img src={sunPng} alt="Logo"/>
                        </div>
                        <div>
                            <img src={i18nLight} style={{marginTop: 20}} alt="Logo"/>
                        </div>
                    </div>
                </div>
                <div className={classModule.loginTopic}>
                    密码登录
                </div>
                <div className={classModule.loginInput}>
                    <UsernameLogin status={loginStatus}></UsernameLogin>
                </div>
                <div className={classModule.loginRemember}>
                    <div style={{display: "flex", flexDirection: "row", alignItems: "center", marginLeft: 20}}>
                        <div>
                            <input style={{width: 20, height: 20}} type="checkbox"/>
                        </div>
                        <div style={{marginLeft: 10}}>
                            <a href="javascript:" style={{color: "#333639"}}>记住我</a>
                        </div>
                    </div>
                    <div style={{marginRight: 30}}>
                        <a href="javascript:" style={{color: "#333639"}}>忘记密码？</a>
                    </div>
                </div>
                <div className={classModule.loginButton}>
                    <Button style={{
                        width: 400, height: 40,
                        fontSize: 20, fontWeight: "bold", borderRadius: 40
                    }} type="primary"
                            block onClick={() => setLoginStatus(!loginStatus)}>确认</Button>
                </div>
                <div className={classModule.loginOthers}>
                    <div>
                        其他账号登录
                    </div>
                    <div style={{marginTop: 10, marginLeft: 20}}>
                        <img src={messagePng} alt="Logo"/>
                        <img src={wechatPng} alt="Logo"/>
                        <img src={microblogPng} alt="Logo"/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login