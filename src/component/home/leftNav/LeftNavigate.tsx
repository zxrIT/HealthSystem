import {FC, ReactElement, useEffect} from "react"
import {useState} from "react"
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
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store";
import {useTranslation} from "react-i18next";
import {changeInternationalization} from "../../../store/slice/topicSlice.ts";
import {Tooltip} from "antd";

const LeftNavigate: FC = (): ReactElement => {
    const [t, i18n] = useTranslation();
    const user = useSelector((state: RootState) => state.user);
    const navigate: NavigateFunction = useNavigate()
    const topicSlice = useSelector((state: RootState) => state.topic);
    const [loadingStatus, setLoadingStatus] = useState<LeftNavigateEnum>(LeftNavigateEnum.ChargeUp)
    const dispatch = useDispatch()

    useEffect(() => {
        i18n.changeLanguage(topicSlice.internationalization ? "en" : "zh")
    }, [topicSlice.internationalization])

    const changeLoadingStatus = (status: LeftNavigateEnum, navigateUrl: NavigateUrl): void => {
        setLoadingStatus(status)
        navigate(navigateUrl)
    }

    return (
        <div className={leftNavigate.leftBox}>
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
                     changeLoadingStatus(LeftNavigateEnum.Calendar, NavigateUrl.home)
                 }}><SlidersOutlined/>&nbsp;{t("Calendar analysis")}
            </div>
            <div className={!topicSlice.internationalization ? leftNavigate.leftNav : leftNavigate.leftNavEn}
                 style={loadingStatus === LeftNavigateEnum.AnnaAccount ?
                     {border: "2px solid aliceblue", color: "cornflowerblue", backgroundColor: "aliceblue"} :
                     {}}
                 onClick={() => {
                     changeLoadingStatus(LeftNavigateEnum.AnnaAccount, NavigateUrl.dayBook)
                 }}><LineChartOutlined/>&nbsp;{t("Annual analysis")}
            </div>
            <div className={!topicSlice.internationalization ? leftNavigate.leftNav : leftNavigate.leftNavEn}
                 style={loadingStatus === LeftNavigateEnum.MySelf ?
                     {border: "2px solid aliceblue", color: "cornflowerblue", backgroundColor: "aliceblue"} :
                     {}}
                 onClick={() => {
                     changeLoadingStatus(LeftNavigateEnum.MySelf, NavigateUrl.dayBook)
                 }}><TeamOutlined/>&nbsp;{t("My information")}
            </div>
            <div className={!topicSlice.internationalization ? leftNavigate.leftMessage : leftNavigate.leftMessageEn}>
                <Tooltip title={!topicSlice.internationalization ? "" : t("forewarning")} color="gold">
                    <div onClick={() => {
                        dispatch(changeInternationalization(!topicSlice.internationalization))
                    }}><WarningOutlined/>&nbsp;
                        <text
                            style={{display: !topicSlice.internationalization ? "" : "none"}}>{t("forewarning")}</text>
                    </div>
                </Tooltip>
                <Tooltip title={!topicSlice.internationalization ? "" : t("quit")} color="volcano">
                    <div><LogoutOutlined/>&nbsp;
                        <text style={{display: !topicSlice.internationalization ? "" : "none"}}>{t("quit")}</text>
                    </div>
                </Tooltip>
            </div>
        </div>
    )
}

export default LeftNavigate