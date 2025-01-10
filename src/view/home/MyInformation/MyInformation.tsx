import {FC, ReactElement, useEffect} from "react"
import classStyle from "./MyInformation.module.less"
import {Badge, ConfigProvider, Descriptions, DescriptionsProps, theme} from "antd";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";
import DashboardChart from "../../../echartsComponent/dashboard/DashboardChart.tsx";
import RadarChart from "../../../echartsComponent/RadarChart/RadarChart.tsx";
import TodoList from "../../../component/todoList/TodoList.tsx";
import Regex from "../../../util/Regex.ts";

const MyInformation: FC = (): ReactElement => {
    const [t, i18n] = useTranslation();
    const topicSlice = useSelector((state: RootState) => state.topic)
    const user = useSelector((state: RootState) => state.user)
    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: t("username"),
            children: user.user.username,
        },
        {
            key: '2',
            label: t("mobile"),
            children: user.user.mobile,
        },
        {
            key: '3',
            label: t("Identification number"),
            children: user.user.identityCard,
            span: 2
        },
        {
            key: '4',
            label: t("e-mail"),
            children: "zengxiangruiit@yeah.net",
            span: 2
        },
        {
            key: '5',
            label: t("Authentication status"),
            children: <Badge status={
                (Regex.regexIdentityCard.test(user.user.identityCard) &&
                    Regex.regexMobile.test(user.user.mobile)) ? "success" : "default"
            } text={
                (Regex.regexIdentityCard.test(user.user.identityCard) &&
                    Regex.regexMobile.test(user.user.mobile)) ? t("Successful authentication")
                    : t("Not authenticated")
            }/>,
            span: 2,
        },
    ];

    useEffect(() => {
        i18n.changeLanguage(topicSlice.internationalization ? "en" : "zh")
    }, [topicSlice.internationalization])
    return (
        <ConfigProvider theme={{
            algorithm: topicSlice.topic ? theme.defaultAlgorithm : theme.darkAlgorithm
        }}>
            <div className={classStyle.MyInformationBox}>
                <div className={classStyle.MyInformation}>
                    <div className={classStyle.InformationBox}>
                        <Descriptions title={`${t("User information")}`}
                                      bordered items={items} size="small"
                                      column={2}/>
                    </div>
                    <div className={classStyle.uploadFile}>
                    </div>
                </div>
                <div className={classStyle.CurrentInformation}>
                    <div className={classStyle.CurrentInformationChart}>
                        <div className={classStyle.RadarChart}>
                            <RadarChart/>
                        </div>
                        <div className={classStyle.dashboard}>
                            <DashboardChart/>
                        </div>
                    </div>
                    <div className={classStyle.CurrentInformationTodoList}>
                        <TodoList/>
                    </div>
                </div>
            </div>
        </ConfigProvider>
    )
}

export default MyInformation