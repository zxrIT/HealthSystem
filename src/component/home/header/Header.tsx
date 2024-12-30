import {FC, ReactElement, useEffect} from "react"
import {Fragment, useState} from "react"
import header from "./Header.module.less"
import {Button, Drawer, Tooltip} from "antd";
import {AlipayCircleOutlined, WechatOutlined} from "@ant-design/icons"
import {Upload} from "../../../typing/enum/index";
import UploadCheck from "../../../view/upload/UploadCheck.tsx";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";

const Header: FC = (): ReactElement => {
    const [income, setIncome] = useState<number>(111111.03)
    const [disburse, setDisburse] = useState<number>(11111.01)
    const [open, setOpen] = useState<boolean>(false);
    const [uploadTitle, setUploadTitle] = useState<string>("")
    const [uploadComponent, setUploadComponent] = useState<Upload>()
    const [t, i18n] = useTranslation();
    const topicSlice = useSelector((state: RootState) => state.topic);

    useEffect(() => {
        i18n.changeLanguage(topicSlice.internationalization ? "en" : "zh")
    }, [topicSlice.internationalization])


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
            <Drawer onClose={onClose} open={open}>
                {uploadComponent === Upload.ali ? <UploadCheck uploadTitle={uploadTitle} uploadType={Upload.ali}
                                                               changeDrawerStatus={changeDrawerStatus}/> :
                    <UploadCheck uploadTitle={uploadTitle} uploadType={Upload.weiChect}
                                 changeDrawerStatus={changeDrawerStatus}/>}
            </Drawer>
            <div className={header.headerBox}>
                <div className={header.moneyBox}>
                    <div className={header.money}>¥&nbsp;{income}</div>
                    <div className={header.title}>{t("income")}</div>
                </div>
                <div className={header.moneyBox}>
                    <div className={header.money}>¥&nbsp;{disburse}</div>
                    <div className={header.title}>{t("disburse")}</div>
                </div>
                <div className={header.echartsBox}>
                    <div className={header.echartsMoney}>
                        <div className={header.echartsLeftTop}>¥&nbsp;{income - disburse}</div>
                        <div className={header.echartsLeftBottom}>{t("surplus")}</div>
                    </div>
                    <div className={header.echartsRender}>
                        <div className={header.upload}>
                            <Tooltip title={!topicSlice.internationalization ? "" : t("Last commit time")}>
                                <div>
                                    <div style={{marginBottom: 5}}>{t("Last start time")}</div>
                                    2024-1-3
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
                                    2024-1-3
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
        </Fragment>
    )
}

export default Header