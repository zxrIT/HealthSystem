import {FC, ReactElement, useEffect} from "react"
import {Fragment, useState} from "react"
import header from "./Header.module.less"
import {Button, Drawer} from "antd";
import {AlipayCircleOutlined, WechatOutlined} from "@ant-design/icons"
import {Upload} from "../../../typing/enum/index";
import UploadCheck from "../../../view/upload/UploadCheck.tsx";

const Header: FC = (): ReactElement => {
    const [income, setIncome] = useState<number>(111111.03)
    const [disburse, setDisburse] = useState<number>(11111.01)
    const [open, setOpen] = useState<boolean>(false);
    const [uploadTitle, setUploadTitle] = useState<string>("")
    const [uploadComponent, setUploadComponent] = useState<Upload>()
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
                    <div className={header.title}>收入</div>
                </div>
                <div className={header.moneyBox}>
                    <div className={header.money}>¥&nbsp;{disburse}</div>
                    <div className={header.title}>支出</div>
                </div>
                <div className={header.echartsBox}>
                    <div className={header.echartsMoney}>
                        <div className={header.echartsLeftTop}>¥&nbsp;{income - disburse}</div>
                        <div className={header.echartsLeftBottom}>结余</div>
                    </div>
                    <div className={header.echartsRender}>
                        <div className={header.upload}>
                            <div>
                                上一次上传时间
                                2024-1-3
                            </div>
                            <Button icon={<AlipayCircleOutlined/>}
                                    type="primary"
                                    style={{marginTop: "20px"}}
                                    onClick={() => {
                                        showDrawer("支付宝上传", Upload.ali)
                                    }}>
                                支付宝上传
                            </Button>
                        </div>
                        <div className={header.upload}>
                            <div>
                                上一次上传时间
                                2024-1-3
                            </div>
                            <Button icon={<WechatOutlined/>} type="primary"
                                    style={{
                                        backgroundColor: "limegreen",
                                        marginTop: "20px"
                                    }} onClick={() => {
                                showDrawer("微信上传", Upload.weiChect)
                            }}>
                                微信上传
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Header