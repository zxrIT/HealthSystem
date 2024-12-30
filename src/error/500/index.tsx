import {FC, ReactElement, useEffect} from "react"
import serverErrorStyle from "./index.module.less"
import serverError from "../../assets/static/system/svg/service-error.svg"
import {Button, message} from "antd";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../store";

const ServerError: FC = (): ReactElement => {
    const [t, i18n] = useTranslation();
    const topicSlice = useSelector((state: RootState) => state.topic);

    useEffect(() => {
        i18n.changeLanguage(topicSlice.internationalization ? "en" : "zh")
    }, [topicSlice.internationalization])
    const navigateFunction: NavigateFunction = useNavigate();
    useEffect(() => {
        message.error(t("Please try again later or contact the administrator to resolve the problem"))
    })
    return (
        <div className={serverErrorStyle.serverErrorBox}>
            <img className={serverErrorStyle.img} src={serverError} alt="500"/>
            <Button type="primary" onClick={() => {
                navigateFunction("/")
            }}>{t("Please try again later or contact the administrator to resolve the problem")}</Button>
        </div>
    )
}

export default ServerError