import {FC, ReactElement, useEffect} from "react"
import {Fragment, useState} from "react"
import header from "./Header.module.less"
import {Button, ConfigProvider, Drawer, theme, Tooltip} from "antd";
import {AlipayCircleOutlined, WechatOutlined} from "@ant-design/icons"
import {Upload} from "../../../typing/enum/index";
import UploadCheck from "../../../view/upload/UploadCheck.tsx";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";
import {getSurplusService, getTimeService} from "../../../service/bookKeepingService";
import {ISurplus, IUploadTime} from "../../../typing/bookKeeping/bookKeeping.ts";
import {BaseResponse} from "../../../typing/response/baseResponse.ts";
import {format, parse} from 'date-fns';

const Header: FC = (): ReactElement => {
    const [aliUploadTime, setAliUploadTime] = useState<String>("2025-03-01");
    const [wechatUploadTime, setWechatUploadTime] = useState<String>("2025-03-01");
    const [income, setIncome] = useState<number>(21316.03)
    const [disburse, setDisburse] = useState<number>(19128.61)
    const [open, setOpen] = useState<boolean>(false);
    const [uploadTitle, setUploadTitle] = useState<string>("")
    const [uploadComponent, setUploadComponent] = useState<Upload>()
    const [t, i18n] = useTranslation();
    const topicSlice = useSelector((state: RootState) => state.topic);


    useEffect(() => {
        i18n.changeLanguage(topicSlice.internationalization ? "en" : "zh")
    }, [topicSlice.internationalization])

    useEffect(() => {
        getSurplusService<BaseResponse<ISurplus>>().then((response) => {
            if (response.code === 200) {
                setIncome(response.data.income)
                setDisburse(response.data.disburse)
            }
        })
    }, []);

    useEffect(() => {
        getTimeService<BaseResponse<IUploadTime>>().then((response) => {
            if (response.code === 200) {
                if (response.data.alipay !== null && response.data.alipay !== undefined) {
                    const date = parse(response.data.alipay, "MMM d, yyyy, hh:mm:ss aa", new Date());
                    setAliUploadTime(format(date, "yyyy-MM-dd"));
                }
                if (response.data.wechat !== null && response.data.wechat !== undefined) {
                    const date = parse(response.data.wechat, "MMM d, yyyy, hh:mm:ss aa", new Date());
                    setWechatUploadTime(format(date, "yyyy-MM-dd"));
                }
            }
        })
    }, []);


    useEffect(() => {
        setIncome(income)
        setDisburse(disburse)
    }, [])

    const showDrawer = (uploadTitle: string, uploadComponent: Upload) => {
        setUploadComponent(uploadComponent)
        setUploadTitle(uploadTitle)
        setOpen(true);
    };

    const changeDrawerStatus = (status: boolean) => {
        setOpen(status)
    }

    const onClose = () => {
        setOpen(false);
    };

    return (
        <Fragment>
            <ConfigProvider theme={{
                algorithm: topicSlice.topic ? theme.defaultAlgorithm : theme.darkAlgorithm
            }}>
                <Drawer onClose={onClose} open={open}>
                    {uploadComponent === Upload.ali ? <UploadCheck uploadTitle={uploadTitle} uploadType={Upload.ali}
                                                                   changeDrawerStatus={changeDrawerStatus}/> :
                        <UploadCheck uploadTitle={uploadTitle} uploadType={Upload.weiChect}
                                     changeDrawerStatus={changeDrawerStatus}/>}
                </Drawer>
                <div className={topicSlice.topic ? header.headerBox : header.headerBoxDark}>
                    <div className={header.moneyBox}>
                        <div className={header.money} style={{marginRight: 20}}>¥&nbsp;{income.toFixed(2)}</div>
                        <div className={header.title}>{t("income")}</div>
                    </div>
                    <div className={header.moneyBox}>
                        <div className={header.money}>¥&nbsp;{disburse.toFixed(2)}</div>
                        <div className={header.title}>{t("disburse")}</div>
                    </div>
                    <div className={header.echartsBox}>
                        <div className={header.echartsMoney}>
                            <div className={header.echartsLeftTop}>¥&nbsp;{(income - disburse).toFixed(2)}</div>
                            <div className={header.echartsLeftBottom}>{t("surplus")}</div>
                        </div>
                        <div className={header.echartsRender}>
                            <div className={header.upload}>
                                <Tooltip title={!topicSlice.internationalization ? "" : t("Last commit time")}>
                                    <div>
                                        <div style={{marginBottom: 5}}>{t("Last start time")}</div>
                                        {aliUploadTime}
                                    </div>
                                </Tooltip>
                                <Button icon={<AlipayCircleOutlined/>}
                                        type="primary"
                                        style={{marginTop: "20px"}}
                                        onClick={() => {
                                            showDrawer(t("Alipay upload"), Upload.ali)
                                        }}>
                                    {t("Alipay upload")}
                                </Button>
                            </div>
                            <div className={header.upload}>
                                <Tooltip title={!topicSlice.internationalization ? "" : t("Last commit time")}>
                                    <div>
                                        <div style={{marginBottom: 5}}>{t("Last start time")}</div>
                                        {wechatUploadTime}
                                    </div>
                                </Tooltip>
                                <Button icon={<WechatOutlined/>} type="primary"
                                        style={{
                                            backgroundColor: "limegreen",
                                            marginTop: "20px"
                                        }} onClick={() => {
                                    showDrawer(t("Wechat upload"), Upload.weiChect)
                                }}>
                                    {t("Wechat upload")}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </ConfigProvider>
        </Fragment>
    )
}

export default Header