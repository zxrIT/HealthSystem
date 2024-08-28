import React, {useState} from "react"
import {Link} from "react-router-dom"
import header from "./Header.module.less"
import type {FC, ReactElement} from "react"
import {Button} from "antd";
import {AlipayCircleOutlined, WechatOutlined} from "@ant-design/icons"

const Header: FC = (): ReactElement => {
    const [income, setIncome] = useState<number>(111111.03)
    const [disburse, setDisburse] = useState<number>(11111.01)

    return (
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
                                style={{marginTop: "20px"}}>
                            <Link to="/util/uploadAli" target="_blank" rel="noopener noreferrer">
                                支付宝上传
                            </Link>
                        </Button>
                    </div>
                    <div className={header.upload}>
                        <div>
                            上一次上传时间
                            2024-1-3
                        </div>
                        <Button icon={<WechatOutlined/>} type="primary"
                                style={{backgroundColor: "limegreen", marginTop: "20px"}}>微信上传</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header