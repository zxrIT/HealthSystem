import {FC, ReactElement, useEffect, useRef} from "react"
import classStyle from "./BarChart.module.less"
import ReactECharts from "echarts-for-react";
import echartsNight from "../../topic/echarts.json"
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import echartsDark from "../../topic/echarts-dark.json";


const BarChart: FC = (): ReactElement => {
    const [t, i18n] = useTranslation();
    const topicSlice = useSelector((state: RootState) => state.topic);
    const barChartRef = useRef(null);

    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        legend: {},
        xAxis: {
            type: 'value'
        },
        yAxis: {
            type: 'category',
            data: [t("Investment"), t("Transfer of money"),
                t("Food and Beverage"), t("Transportation and travel"),
                t("E-commerce consumption"),
                t("Car maintenance")],
        },
        series: [
            {
                name: t("economize"),
                type: 'bar',
                stack: 'total',
                label: {
                    show: true
                },
                emphasis: {
                    focus: 'series'
                },
                data: [320, 302, 301, 334, 390, 330, 320]
            },
            {
                name: t("normal"),
                type: 'bar',
                stack: 'total',
                label: {
                    show: true
                },
                emphasis: {
                    focus: 'series'
                },
                data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
                name: t("Normal overflow range"),
                type: 'bar',
                stack: 'total',
                label: {
                    show: true
                },
                emphasis: {
                    focus: 'series'
                },
                data: [220, 182, 191, 234, 290, 330, 310]
            },
            {
                name: t("overflow"),
                type: 'bar',
                stack: 'total',
                label: {
                    show: true
                },
                emphasis: {
                    focus: 'series'
                },
                data: [150, 212, 201, 154, 190, 330, 410]
            },
            {
                name: t("Amount of excess"),
                type: 'bar',
                stack: 'total',
                label: {
                    show: true
                },
                emphasis: {
                    focus: 'series'
                },
                data: [820, 832, 901, 934, 1290, 1330, 1320]
            }]
    };

    useEffect(() => {
        i18n.changeLanguage(topicSlice.internationalization ? "en" : "zh");
    }, [topicSlice.internationalization])

    return (
        <div className={classStyle.barBox} ref={barChartRef}>
            <ReactECharts
                theme={topicSlice.topic ? echartsNight : echartsDark}
                option={option}
                style={{height: "100%", width: "100%"}}
            />
        </div>
    )
}

export default BarChart