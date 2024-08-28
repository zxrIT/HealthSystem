import type {FC, ReactElement} from "react"
import React, {useState} from "react"
import type {NavigateFunction} from "react-router-dom"
import {useNavigate} from "react-router-dom"
import leftNavigate from "./LeftNavigate.module.less"
import mapImg from "../../../assets/static/system/user.jpg"
import {
    BarChartOutlined,
    LineChartOutlined,
    LogoutOutlined,
    PieChartOutlined,
    SlidersOutlined,
    WarningOutlined
} from "@ant-design/icons";
import {LeftNavigateEnum, NavigateUrl} from "../../../typing/enum/index";

const LeftNavigate: FC = (): ReactElement => {
    const navigate: NavigateFunction = useNavigate()
    const [loadingStatus, setLoadingStatus] = useState<LeftNavigateEnum>(LeftNavigateEnum.ChargeUp)

    const changeLoadingStatus = (status: LeftNavigateEnum, navigateUrl: NavigateUrl): void => {
        setLoadingStatus(status)
        navigate(navigateUrl)
    }

    return (
        <div className={leftNavigate.leftBox}>
            <div className={leftNavigate.leftUserImg}>
                <img src={mapImg} alt="userPicture"/>
            </div>
            <div className={leftNavigate.leftUserName}>秃头统治地球的健康账单</div>
            <div className={leftNavigate.leftNav}
                 style={loadingStatus === LeftNavigateEnum.ChargeUp ?
                     {border: "2px solid aliceblue", color: "cornflowerblue", backgroundColor: "aliceblue"} :
                     {}}
                 onClick={() => {
                     changeLoadingStatus(LeftNavigateEnum.ChargeUp, NavigateUrl.home);
                 }}><PieChartOutlined/>&nbsp;健康记账
            </div>
            <div className={leftNavigate.leftNav} style={loadingStatus === LeftNavigateEnum.DayBook ?
                {border: "2px solid aliceblue", color: "cornflowerblue", backgroundColor: "aliceblue"} :
                {}}
                 onClick={() => {
                     changeLoadingStatus(LeftNavigateEnum.DayBook, NavigateUrl.dayBook)
                 }}><BarChartOutlined/>&nbsp;日帐分析
            </div>
            <div className={leftNavigate.leftNav} style={loadingStatus === LeftNavigateEnum.Calendar ?
                {border: "2px solid aliceblue", color: "cornflowerblue", backgroundColor: "aliceblue"} :
                {}}
                 onClick={() => {
                     changeLoadingStatus(LeftNavigateEnum.Calendar, NavigateUrl.home)
                 }}><SlidersOutlined/>&nbsp;日历分析
            </div>
            <div className={leftNavigate.leftNav} style={loadingStatus === LeftNavigateEnum.AnnaAccount ?
                {border: "2px solid aliceblue", color: "cornflowerblue", backgroundColor: "aliceblue"} :
                {}}
                 onClick={() => {
                     changeLoadingStatus(LeftNavigateEnum.AnnaAccount, NavigateUrl.dayBook)
                 }}><LineChartOutlined/>&nbsp;年帐分析
            </div>
            <div className={leftNavigate.leftMessage}>
                <div><WarningOutlined/>&nbsp;预警</div>
                <div><LogoutOutlined/>&nbsp;退出</div>
            </div>
        </div>
    )
}

export default LeftNavigate