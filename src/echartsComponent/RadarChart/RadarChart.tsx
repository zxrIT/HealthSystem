import {FC, ReactElement, useEffect} from "react"
import classStyle from "./RadarChart.module.less"
import ReactECharts from "echarts-for-react";
import echartsNight from "../../topic/echarts.json";
import echartsDark from "../../topic/echarts-dark.json";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../store";

const RadarChart: FC = (): ReactElement => {
    const [_, i18n] = useTranslation();
    const topicSlice = useSelector((state: RootState) => state.topic);
    const option = {
        radar: {
            indicator: [
                { name: 'Sales', max: 6500 },
                { name: 'Administration', max: 16000 },
                { name: 'Information Technology', max: 30000 },
                { name: 'Customer Support', max: 38000 },
                { name: 'Development', max: 52000 },
                { name: 'Marketing', max: 25000 }
            ]
        },
        series: [
            {
                name: 'Budget vs spending',
                type: 'radar',
                data: [
                    {
                        value: [4200, 3000, 20000, 35000, 50000, 18000],
                        name: 'Allocated Budget'
                    },
                    {
                        value: [5000, 14000, 28000, 26000, 42000, 21000],
                        name: 'Actual Spending'
                    }
                ]
            }
        ]
    };
    useEffect(() => {
        i18n.changeLanguage(topicSlice.internationalization ? "en" : "zh");
    }, [topicSlice.internationalization])
    return (
        <div className={classStyle.RadarChartBox}>
            <ReactECharts
                theme={topicSlice.topic ? echartsNight : echartsDark}
                option={option}
                style={{height: "100%", width: "100%"}}
            />
        </div>
    )
}

export default RadarChart