import {FC, Fragment, ReactElement, useEffect, useRef} from "react"
import classStyle from "./FunnelChart.module.less"
import ReactECharts from "echarts-for-react";
import echartsDark from "../../topic/echarts-dark.json"
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import echartsNight from "../../topic/echarts.json";
import {ConfigProvider, DatePicker, FloatButton, Form, Popover, theme} from "antd";
import {HistoryOutlined} from "@ant-design/icons";

const FunnelChart: FC = (): ReactElement => {
    const [t, i18n] = useTranslation();
    const topicSlice = useSelector((state: RootState) => state.topic);
    const funnelChartRef = useRef(null);
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c}%"
        },
        toolbox: {
            feature: {
                dataView: {readOnly: false},
                restore: {},
                saveAsImage: {}
            }
        },
        legend: {
            bottom: '5%',
            left: 'center',
            data: [t("Investment"), t("Transfer of money"), t("Food and Beverage")
                , t("Transportation and travel"), t("E-commerce consumption")]
        },
        series: [
            {
                name: t("Expectation"),
                type: 'funnel',
                left: '10%',
                width: '80%',
                label: {
                    normal: {
                        formatter: `{b}${t("Expectation")}`
                    },
                    emphasis: {
                        position: 'inside',
                        formatter: `{b}${t("Expectation")}: {c}%`
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        opacity: 0.7
                    }
                },
                data: [
                    {value: 60, name: t("Investment")},
                    {value: 40, name: t("Transfer of money")},
                    {value: 20, name: t("Food and Beverage")},
                    {value: 80, name: t("Transportation and travel")},
                    {value: 100, name: t("E-commerce consumption")}
                ]
            },
            {
                name: t("practice"),
                type: 'funnel',
                left: '10%',
                width: '80%',
                maxSize: '80%',
                label: {
                    normal: {
                        position: 'inside',
                        formatter: '{c}%',
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    emphasis: {
                        position: 'inside',
                        formatter: `{b}${t("practice")}: {c}%`
                    }
                },
                itemStyle: {
                    normal: {
                        opacity: 0.5,
                        borderColor: '#fff',
                        borderWidth: 2
                    }
                },
                data: [
                    {value: 30, name: t("Investment")},
                    {value: 10, name: t("Transfer of money")},
                    {value: 5, name: t("Food and Beverage")},
                    {value: 50, name: t("Transportation and travel")},
                    {value: 80, name: t("E-commerce consumption")}
                ]
            }
        ]
    };

    useEffect(() => {
        i18n.changeLanguage(topicSlice.internationalization ? "en" : "zh");
    }, [topicSlice.internationalization])

    return (
        <ConfigProvider theme={{algorithm: topicSlice.topic ? theme.defaultAlgorithm : theme.darkAlgorithm}}>
            <Fragment>
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
                <div className={classStyle.funnelBox} ref={funnelChartRef}>
                    <ReactECharts
                        theme={topicSlice.topic ? echartsNight : echartsDark}
                        ref={funnelChartRef}
                        option={option}
                        style={{height: "100%", width: "100%"}}
                    />
                </div>
            </Fragment>
        </ConfigProvider>
    )
}

export default FunnelChart