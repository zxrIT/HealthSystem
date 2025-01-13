import {FC, Fragment, ReactElement, useEffect} from "react"
import classStyle from "./MyInformation.module.less"
import {
    Badge,
    ConfigProvider,
    DatePicker,
    Descriptions,
    DescriptionsProps,
    FloatButton,
    Form,
    Popover,
    theme
} from "antd";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";
import DashboardChart from "../../../echartsComponent/dashboard/DashboardChart.tsx";
import RadarChart from "../../../echartsComponent/RadarChart/RadarChart.tsx";
import TodoList from "../../../component/todoList/TodoList.tsx";
import Regex from "../../../util/Regex.ts";
import UploadFile from "../../../component/uploadFile/UploadFile.tsx";
import {HistoryOutlined} from "@ant-design/icons";

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
            children: user.user.email,
            span: 2
        },
        {
            key: '5',
            label: t("Authentication status"),
            children: <Badge status={
                (Regex.regexIdentityCard.test(user.user.identityCard) &&
                    Regex.regexMobile.test(user.user.mobile) && Regex.regexEmail.test(user.user.email)) ? "success" : "default"
            } text={
                (Regex.regexIdentityCard.test(user.user.identityCard) &&
                    Regex.regexMobile.test(user.user.mobile) && Regex.regexEmail.test(user.user.email)) ? t("Successful authentication")
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
            <Popover content={
                <Fragment>
                    <Form>
                        <Form.Item
                            label="DatePicker"
                            name="DatePicker"
                        >
                            <DatePicker/>
                        </Form.Item>
                    </Form>
                </Fragment>
            } title={t("Choose a Start time")}>
                <FloatButton
                    tooltip={t("Click to select the start time")}
                    shape="square"
                    type="primary"
                    style={{insetInlineEnd: 1100}}
                    icon={<HistoryOutlined/>}
                />
            </Popover>
            <div className={classStyle.MyInformationBox}>
                <div className={classStyle.MyInformation}>
                    <div className={classStyle.InformationBox}>
                        <Descriptions title={`${t("User information")}`}
                                      bordered items={items} size="small"
                                      column={2}/>
                    </div>
                    <div className={classStyle.uploadFile}>
                        <UploadFile/>
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