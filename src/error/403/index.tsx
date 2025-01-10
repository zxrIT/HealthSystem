import {FC, ReactElement, useEffect} from "react"
import forbiddenStyle from "./index.module.less"
import noPermission from "../../assets/static/system/svg/no-permission.svg"
import {Button, message} from "antd";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../store";

const Forbidden: FC = (): ReactElement => {
    const [t, i18n] = useTranslation();
    const topicSlice = useSelector((state: RootState) => state.topic);

    useEffect(() => {
        i18n.changeLanguage(topicSlice.internationalization ? "en" : "zh")
    }, [topicSlice.internationalization])
    const navigateFunction: NavigateFunction = useNavigate();
    useEffect(() => {
        message.error(t("Login has expired or no login, please log in before using"))
    })
    return (
        <div className={topicSlice.topic ? forbiddenStyle.forbiddenBox : forbiddenStyle.forbiddenBoxDark}>
            <img className={forbiddenStyle.img} src={noPermission} alt="403"/>
            <Button type="primary" onClick={() => {
                navigateFunction("/")
            }}>{t("Go to login")}</Button>
        </div>
    )
}

export default Forbidden