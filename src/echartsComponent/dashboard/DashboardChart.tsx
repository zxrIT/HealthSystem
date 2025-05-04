import {FC, ReactElement, useEffect} from "react"
import classStyle from "./Dashboard.module.less"
import echartsNight from "../../topic/echarts.json";
import echartsDark from "../../topic/echarts-dark.json";
import ReactECharts from "echarts-for-react";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../store";

const DashboardChart: FC = (): ReactElement => {
    const [t, i18n] = useTranslation();
    const topicSlice = useSelector((state: RootState) => state.topic);
    const option = {
        tooltip: {
            formatter: '{a} <br/>{b} : {c}%'
        },
        series: [
            {
                name: t("disburse"),
                type: 'gauge',
                detail: {
                    formatter: '{value}'
                },
                data: [
                    {
                        value: 84,
                        name: t("Proportion")
                    }
                ]
            }
        ]
    };

    useEffect(() => {
        i18n.changeLanguage(topicSlice.internationalization ? "en" : "zh");
    }, [topicSlice.internationalization])

    return (
        <div className={classStyle.dashboardBox}>
            <ReactECharts
                theme={topicSlice.topic ? echartsNight : echartsDark}
                option={option}
                style={{height: "100%", width: "100%"}}
            />
        </div>
    )
}

export default DashboardChart