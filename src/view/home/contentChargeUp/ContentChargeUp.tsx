import React, {Fragment, useState} from "react"
import {Button, Space, Table} from 'antd';
import contentChargeUp from "./ContentChargeUp.module.less"
import type {FC, ReactElement} from "react"
import {PlusOutlined} from "@ant-design/icons"
import {FloatButton} from 'antd';

interface DataType {
    key: string;
    transactionClassification: string;
    tradeDescription: string;
    transactionAmount: string;
    paymentMethod: string;
}

const data: DataType[] = [
    {
        key: "20240825220011472",
        transactionClassification: "数码电器",
        tradeDescription: "一二布布适用苹果14pro小熊xs1",
        transactionAmount: "¥ 299.01",
        paymentMethod: "支付宝"
    },
    {
        key: "2020147158146181472",
        transactionClassification: "数码电器",
        tradeDescription: "一二布布适用苹果14pro小熊xs1",
        transactionAmount: "¥ 299.01",
        paymentMethod: "支付宝"
    },
    {
        key: "2024082522001426181472",
        transactionClassification: "数码电器",
        tradeDescription: "一二布布适用苹果14pro小熊xs1",
        transactionAmount: "¥ 299.01",
        paymentMethod: "支付宝"
    },
    {
        key: "202402618147288",
        transactionClassification: "数码电器",
        tradeDescription: "一二布布适用苹果14pro小熊xs1",
        transactionAmount: "¥ 299.01",
        paymentMethod: "支付宝"
    },
    {
        key: "20240261814727777",
        transactionClassification: "数码电器",
        tradeDescription: "一二布布适用苹果14pro小熊xs1",
        transactionAmount: "¥ 299.01",
        paymentMethod: "支付宝"
    },
    {
        key: "20240261814726666",
        transactionClassification: "数码电器",
        tradeDescription: "一二布布适用苹果14pro小熊xs1",
        transactionAmount: "¥ 299.01",
        paymentMethod: "支付宝"
    },
    {
        key: "20240261814725555",
        transactionClassification: "数码电器",
        tradeDescription: "一二布布适用苹果14pro小熊xs1",
        transactionAmount: "¥ 299.01",
        paymentMethod: "支付宝"
    },
    {
        key: "20240261814724444",
        transactionClassification: "数码电器",
        tradeDescription: "一二布布适用苹果14pro小熊xs1",
        transactionAmount: "¥ 299.01",
        paymentMethod: "支付宝"
    },
    {
        key: "20240261814723333",
        transactionClassification: "数码电器",
        tradeDescription: "一二布布适用苹果14pro小熊xs1",
        transactionAmount: "¥ 299.01",
        paymentMethod: "支付宝"
    },
    {
        key: "20240261814722222",
        transactionClassification: "数码电器",
        tradeDescription: "一二布布适用苹果14pro小熊xs1",
        transactionAmount: "¥ 299.01",
        paymentMethod: "支付宝"
    }, {
        key: "202402618147211111",
        transactionClassification: "数码电器",
        tradeDescription: "一二布布适用苹果14pro小熊xs1",
        transactionAmount: "¥ 299.01",
        paymentMethod: "支付宝"
    }, {
        key: "2024026181472111",
        transactionClassification: "数码电器",
        tradeDescription: "一二布布适用苹果14pro小熊xs1",
        transactionAmount: "¥ 299.01",
        paymentMethod: "支付宝"
    }, {
        key: "202402618147211",
        transactionClassification: "数码电器",
        tradeDescription: "一二布布适用苹果14pro小熊xs1",
        transactionAmount: "¥ 299.01",
        paymentMethod: "支付宝"
    },
    {
        key: "2024082526181472",
        transactionClassification: "数码电器",
        tradeDescription: "一二布布适用苹果14pro小熊xs1",
        transactionAmount: "¥ 299.01",
        paymentMethod: "支付宝"
    },
    {
        key: "20240821581426181472",
        transactionClassification: "数码电器",
        tradeDescription: "一二布布适用苹果14pro小熊xs1",
        transactionAmount: "¥ 299.01",
        paymentMethod: "支付宝"
    },
    {
        key: "2024082521581426181472",
        transactionClassification: "数码电器",
        tradeDescription: "一二布布适用苹果14pro小熊xs1",
        transactionAmount: "¥ 299.01",
        paymentMethod: "支付宝"
    },
    {
        key: "222001471581426181472",
        transactionClassification: "数码电器",
        tradeDescription: "一二布布适用苹果14pro小熊xs1",
        transactionAmount: "¥ 299.01",
        paymentMethod: "支付宝"
    },
    {
        key: "2024082522001481472",
        transactionClassification: "数码电器",
        tradeDescription: "一二布布适用苹果14pro小熊xs1",
        transactionAmount: "¥ 299.01",
        paymentMethod: "支付宝"
    },
    {
        key: "20240825220014",
        transactionClassification: "数码电器",
        tradeDescription: "一二布布适用苹果14pro小熊xs1",
        transactionAmount: "¥ 299.01",
        paymentMethod: "支付宝"
    },
    {
        key: "202408252",
        transactionClassification: "数码电器",
        tradeDescription: "一二布布适用苹果14pro小熊xs1",
        transactionAmount: "¥ 299.01",
        paymentMethod: "支付宝"
    },


] as DataType[];

const ContentChargeUp: FC = (): ReactElement => {
    const initPaginationSize: number = 7
    const [paginationSize, setPaginationSize] = useState<number>(initPaginationSize)
    const {Column} = Table;

    return (
        <Fragment>
            <div className={contentChargeUp.chargeUpBox}>
                <Table dataSource={data} expandable={{
                    expandedRowRender: (record) =>
                        <p style={{margin: 0}}>
                            订单序号&nbsp;:&nbsp;{record.key}
                            &nbsp;&nbsp;&nbsp;商品说明&nbsp;:&nbsp;{record.tradeDescription}
                        </p>
                }} pagination={{pageSize: paginationSize}} onExpand={() => {
                    setPaginationSize(paginationSize ===
                        initPaginationSize ? initPaginationSize - 1 : initPaginationSize
                    )
                }}>
                    <Column title="交易单号" dataIndex="key" key="key" align="center"/>
                    <Column title="交易分类"
                            dataIndex="transactionClassification"
                            key="transactionClassification" align="center"/>
                    <Column title="商品说明" dataIndex="tradeDescription"
                            key="tradeDescription" align="center"/>
                    <Column title="交易金额" dataIndex="transactionAmount"
                            key="transactionAmount" align="center"/>
                    <Column title="付款方式" dataIndex="paymentMethod"
                            key="paymentMethod" align="center"/>
                    <Column
                        title="操作"
                        key="action"
                        align="center"
                        render={(_: any, record: DataType) => (
                            <Space size="middle">
                                <Button type="primary">修改</Button>
                                <Button danger type="dashed">删除</Button>
                            </Space>
                        )}
                    />
                </Table>
            </div>
            <FloatButton type="primary" tooltip={<div>添加</div>} icon={<PlusOutlined/>}/>
        </Fragment>
    )
}

export default ContentChargeUp