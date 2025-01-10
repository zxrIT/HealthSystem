import {FC, ReactElement, useEffect} from "react"
import classStyle from "./PieChart.module.less"
import {useTranslation} from "react-i18next";
import ReactECharts from 'echarts-for-react';
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import echartsDark from "../../topic/echarts-dark.json";
import echartsNight from "../../topic/echarts.json";


const PieChartHealth: FC = (): ReactElement => {
    const [t, i18n] = useTranslation();
    const topicSlice = useSelector((state: RootState) => state.topic);

    const option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            top: '5%',
            left: 'center',
            data: [t("Investment"), t("Transfer of money"), t("Food and Beverage")
                , t("Transportation and travel"), t("E-commerce consumption")]
        },
        series: [
            {
                name: '访问来源',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '60%'],
                data: [
                    {value: 335, name: t("Investment")},
                    {value: 310, name: t("Transfer of money")},
                    {value: 234, name: t("Food and Beverage")},
                    {value: 135, name: t("Transportation and travel")},
                    {value: 1548, name: t("E-commerce consumption")}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };


    useEffect(() => {
        i18n.changeLanguage(topicSlice.internationalization ? "en" : "zh");
    }, [topicSlice.internationalization])


    return (
        <div className={classStyle.pieChartBox}>
            <ReactECharts
                theme={topicSlice.topic ? echartsNight : echartsDark}
                option={option}
                style={{height: "100%", width: "100%"}}
            />
        </div>
    )
}

export default PieChartHealth