import {FC, ReactElement, useEffect} from "react"
import forbiddenStyle from "./index.module.less"
import noPermission from "../../assets/static/system/svg/no-permission.svg"
import {Button, message} from "antd";
import {NavigateFunction, useNavigate} from "react-router-dom";

const Forbidden: FC = (): ReactElement => {
    const navigateFunction: NavigateFunction = useNavigate();
    useEffect(() => {
        message.error("登录已过期或没有登录，请登录后再进行使用")
    })
    return (
        <div className={forbiddenStyle.forbiddenBox}>
            <img className={forbiddenStyle.img} src={noPermission} alt="403"/>
            <Button type="primary" onClick={() => {
                navigateFunction("/")
            }}>去登录</Button>
        </div>
    )
}

export default Forbidden