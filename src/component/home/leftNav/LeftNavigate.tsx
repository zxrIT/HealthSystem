import {FC, Fragment, ReactElement, useEffect, useState} from "react"
import type {NavigateFunction} from "react-router-dom"
import {useNavigate} from "react-router-dom"
import leftNavigate from "./LeftNavigate.module.less"
import mapImg from "../../../assets/static/system/icon/user.jpg"
import {
    BarChartOutlined,
    LineChartOutlined,
    LogoutOutlined,
    PieChartOutlined,
    SlidersOutlined, TeamOutlined,
    WarningOutlined
} from "@ant-design/icons";
import {LeftNavigateEnum, NavigateUrl} from "../../../typing/enum";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";
import {useTranslation} from "react-i18next";
import {message, Modal, Tooltip} from "antd";
import {logoutService} from "../../../service/loginService";
import {BaseResponse} from "../../../typing/response/baseResponse.ts";
import {useLocalStorage} from "../../../hooks/useLocalStorage.ts";

const LeftNavigate: FC = (): ReactElement => {
    const [t, i18n] = useTranslation();
    const user = useSelector((state: RootState) => state.user);
    const navigate: NavigateFunction = useNavigate()
    const {removeStorage} = useLocalStorage()
    const [modal, contextHolder] = Modal.useModal();
    const topicSlice = useSelector((state: RootState) => state.topic);
    const [loadingStatus, setLoadingStatus] = useState<LeftNavigateEnum>(LeftNavigateEnum.ChargeUp)
    const logout = async () => {
        if (user.user.id) {
            await logoutService<BaseResponse<string>, string>(user.user.id)
        }
        removeStorage("user")
        removeStorage("authentication")
        message.success("退出成功")
        navigate("/")
    }
    const countDown = () => {
        let secondsToGo = 3;
        const instance = modal.success({
            closable: true,
            onOk: () => {
                logout()
            },
            title: t("Are you sure you want to quit?"),
        });

        const timer = setInterval(() => {
            secondsToGo -= 1;
        }, 1000);
        setTimeout(() => {
            clearInterval(timer);
            instance.destroy();
        }, secondsToGo * 1000);
    }
    useEffect(() => {
        i18n.changeLanguage(topicSlice.internationalization ? "en" : "zh")
    }, [topicSlice.internationalization])

    const changeLoadingStatus = (status: LeftNavigateEnum, navigateUrl: NavigateUrl): void => {
        setLoadingStatus(status)
        navigate(navigateUrl)
    }

    return (
        <Fragment>
            {contextHolder}
            <div className={topicSlice.topic ? leftNavigate.leftBox : leftNavigate.leftBoxDark}>
                <div className={leftNavigate.leftUserImg}>
                    <img src={user.user.imageUrl.length === 0 ? mapImg : user.user.imageUrl} alt="userPicture"/>
                </div>
                <div className={leftNavigate.leftUserName}>{user.user.username}{t("'s Health bill")}</div>
                <div className={!topicSlice.internationalization ? leftNavigate.leftNav : leftNavigate.leftNavEn}
                     style={loadingStatus === LeftNavigateEnum.ChargeUp ?
                         {border: "2px solid aliceblue", color: "cornflowerblue", backgroundColor: "aliceblue"} :
                         {}}
                     onClick={() => {
                         changeLoadingStatus(LeftNavigateEnum.ChargeUp, NavigateUrl.home);
                     }}><PieChartOutlined/>&nbsp;{t("Health accounting")}
                </div>
                <div className={!topicSlice.internationalization ? leftNavigate.leftNav : leftNavigate.leftNavEn}
                     style={loadingStatus === LeftNavigateEnum.DayBook ?
                         {border: "2px solid aliceblue", color: "cornflowerblue", backgroundColor: "aliceblue"} :
                         {}}
                     onClick={() => {
                         changeLoadingStatus(LeftNavigateEnum.DayBook, NavigateUrl.dayBook)
                     }}><BarChartOutlined/>&nbsp;{t("Journal analysis")}
                </div>
                <div className={!topicSlice.internationalization ? leftNavigate.leftNav : leftNavigate.leftNavEn}
                     style={loadingStatus === LeftNavigateEnum.Calendar ?
                         {border: "2px solid aliceblue", color: "cornflowerblue", backgroundColor: "aliceblue"} :
                         {}}
                     onClick={() => {
                         changeLoadingStatus(LeftNavigateEnum.Calendar, NavigateUrl.calendarAnalysis)
                     }}><SlidersOutlined/>&nbsp;{t("Calendar analysis")}
                </div>
                <div className={!topicSlice.internationalization ? leftNavigate.leftNav : leftNavigate.leftNavEn}
                     style={loadingStatus === LeftNavigateEnum.AnnaAccount ?
                         {border: "2px solid aliceblue", color: "cornflowerblue", backgroundColor: "aliceblue"} :
                         {}}
                     onClick={() => {
                         changeLoadingStatus(LeftNavigateEnum.AnnaAccount, NavigateUrl.annualAccountAnalysis)
                     }}><LineChartOutlined/>&nbsp;{t("Annual analysis")}
                </div>
                <div className={!topicSlice.internationalization ? leftNavigate.leftNav : leftNavigate.leftNavEn}
                     style={loadingStatus === LeftNavigateEnum.MySelf ?
                         {border: "2px solid aliceblue", color: "cornflowerblue", backgroundColor: "aliceblue"} :
                         {}}
                     onClick={() => {
                         changeLoadingStatus(LeftNavigateEnum.MySelf, NavigateUrl.myInformation)
                     }}><TeamOutlined/>&nbsp;{t("My information")}
                </div>
                <div
                    className={!topicSlice.internationalization ? leftNavigate.leftMessage : leftNavigate.leftMessageEn}>
                    <Tooltip title={!topicSlice.internationalization ? "" : t("forewarning")} color="gold">
                        <div onClick={()=>{
                            changeLoadingStatus(LeftNavigateEnum.MySelf, NavigateUrl.warning)
                        }}><WarningOutlined/>&nbsp;
                            <text
                                style={{display: !topicSlice.internationalization ? "" : "none"}}>{t("forewarning")}</text>
                        </div>
                    </Tooltip>
                    <Tooltip title={!topicSlice.internationalization ? "" : t("quit")} color="volcano">
                        <div onClick={() => countDown()}><LogoutOutlined/>&nbsp;
                            <text
                                style={{display: !topicSlice.internationalization ? "" : "none"}}>{t("quit")}</text>
                        </div>
                    </Tooltip>
                </div>
            </div>
        </Fragment>
    )
}
export default LeftNavigate