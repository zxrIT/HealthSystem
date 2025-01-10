import {FC, Fragment, ReactElement, useEffect, useRef, useState} from "react"
import classStyle from "./YearsDatasetChart.module.less"
import echartsNight from "../../topic/echarts.json";
import echartsDark from "../../topic/echarts-dark.json";
import ReactECharts, {EChartsInstance} from "echarts-for-react";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {ConfigProvider, DatePicker, FloatButton, Form, Popover, theme} from "antd";
import {HistoryOutlined} from "@ant-design/icons";
import {useForm} from "antd/es/form/Form";

type DatasetSourceDate = string[]
type DatasetSourcePrice = number[]

const YearsDatasetChart: FC = (): ReactElement => {
    const [t, i18n] = useTranslation();
    const yearDatasetChartRef = useRef(null);
    const [antdForm] = useForm()
    const [yearList, setYearList] = useState<DatasetSourceDate>(() => {
        const yearTempList: DatasetSourceDate = []
        let currentYear = new Date().getFullYear()
        for (let i = 0; i <= 5; i++) {
            yearTempList.unshift((currentYear - i).toString())
        }
        return yearTempList
    })
    const [eCommerceConsumption] = useState<DatasetSourcePrice>(
        [56555.5, 82123.1, 88889.7, 70124.1, 53765.4, 85357.1]
    )
    const [foodBeverage] = useState<DatasetSourcePrice>(
        [51123.1, 61112.4, 35112.1, 53123.3, 71233.8, 62348.7]
    )
    const [merchantConsumption] = useState<DatasetSourcePrice>(
        [40871.1, 62234.2, 69123.5, 31234.4, 45123.2, 32346.5]
    )
    const [medicalHealth] = useState<DatasetSourcePrice>(
        [25871.2, 37123.1, 41124.2, 18123, 33124.9, 49223.1]
    )
    const topicSlice = useSelector((state: RootState) => state.topic);
    const option = {
        legend: {},
        tooltip: {
            trigger: 'axis',
            showContent: false
        },
        dataset: {
            source: [
                ['health', ...yearList],
                [t("E-commerce consumption"), ...eCommerceConsumption],
                [t("Food and Beverage"), ...foodBeverage],
                [t("Merchant consumption"), ...merchantConsumption],
                [t("Medical and Health"), ...medicalHealth],
            ]
        },
        xAxis: {type: 'category'},
        yAxis: {gridIndex: 0},
        grid: {top: '55%'},
        series: [
            {
                type: 'line',
                smooth: true,
                seriesLayoutBy: 'row',
                emphasis: {focus: 'series'}
            },
            {
                type: 'line',
                smooth: true,
                seriesLayoutBy: 'row',
                emphasis: {focus: 'series'}
            },
            {
                type: 'line',
                smooth: true,
                seriesLayoutBy: 'row',
                emphasis: {focus: 'series'}
            },
            {
                type: 'line',
                smooth: true,
                seriesLayoutBy: 'row',
                emphasis: {focus: 'series'}
            },
            {
                type: 'pie',
                id: 'pie',
                radius: '30%',
                center: ['50%', '25%'],
                emphasis: {
                    focus: 'self'
                },
                label: {
                    formatter: '{b}: {@2020} ({d}%)'
                },
                encode: {
                    itemName: 'health',
                    value: '2020',
                    tooltip: '2020'
                }
            }
        ]
    };
    useEffect(() => {
        i18n.changeLanguage(topicSlice.internationalization ? "en" : "zh");
    }, [topicSlice.internationalization])

    useEffect(() => {
        if (yearDatasetChartRef.current) {
            const myChart = (yearDatasetChartRef.current as EChartsInstance).getEchartsInstance();
            myChart.on('updateAxisPointer', function (event: { axesInfo: any[] }) {
                const xAxisInfo = event.axesInfo[0];
                if (xAxisInfo) {
                    const dimension = xAxisInfo.value + 1;
                    myChart.setOption({
                        series: {
                            id: 'pie',
                            label: {
                                formatter: '{b}: {@[' + dimension + ']} ({d}%)'
                            },
                            encode: {
                                value: dimension,
                                tooltip: dimension
                            }
                        }
                    });
                }
            })
        }
    }, []);

    const PopoverElement = (): ReactElement => {
        return (
            <Fragment>
                <Form form={antdForm}>
                    <Form.Item
                        label="DatePicker"
                        name="DatePicker"
                    >
                        <DatePicker onChange={(_, dateString) => {
                            if (dateString.length > 0) {
                                const yearTempList: DatasetSourceDate = []
                                let currentYear = new Date((dateString as string).substring(0, 4)).getFullYear()
                                for (let i = 0; i <= 5; i++) {
                                    yearTempList.unshift((currentYear - i).toString())
                                }
                                setYearList(yearTempList)
                            } else {
                                const yearTempList: DatasetSourceDate = []
                                let currentYear = new Date().getFullYear()
                                for (let i = 0; i <= 5; i++) {
                                    yearTempList.unshift((currentYear - i).toString())
                                }
                                setYearList(yearTempList)
                            }
                        }}/>
                    </Form.Item>
                </Form>
            </Fragment>
        )
    }

    return (
        <ConfigProvider theme={{algorithm: topicSlice.topic ? theme.defaultAlgorithm : theme.darkAlgorithm}}>
            <div className={classStyle.YearsDatasetChartBox}>
                <Popover content={PopoverElement()} title={t("Choose a Start time")}>
                    <FloatButton
                        tooltip={t("Click to select the start time")}
                        shape="square"
                        type="primary"
                        style={{insetInlineEnd: 24}}
                        icon={<HistoryOutlined/>}
                    />
                </Popover>
                <ReactECharts
                    ref={yearDatasetChartRef}
                    theme={topicSlice.topic ? echartsNight : echartsDark}
                    option={option}
                    style={{height: "100%", width: "100%"}}
                />
            </div>
        </ConfigProvider>
    )
}

export default YearsDatasetChart