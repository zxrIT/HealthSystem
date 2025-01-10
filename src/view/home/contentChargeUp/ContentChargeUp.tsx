import {FC, ReactElement} from "react"
import {Fragment, useEffect, useState} from "react"
import {Button, ConfigProvider, DatePicker, Drawer, FloatButton, Form, Input, message, Space, Table, theme} from 'antd';
import contentChargeUp from "./ContentChargeUp.module.less"
import {PlusOutlined} from "@ant-design/icons"
import type {IBookingBookKeeping, IBookingBookKeepingDisplay} from "../../../typing/bookKeeping/bookKeeping.ts"
import {
    createBookKeepingService,
    deleteBookKeepingService,
    getBookKeepingService,
    updateBookKeepingService
} from "../../../service/bookKeepingService";
import {IBookKeepingResponse} from "../../../typing/response/bookKeepingResponse";
import {BaseResponse} from "../../../typing/response/baseResponse.ts";
import {UpdateOrDeleteEnum} from "../../../typing/enum";
import {useForm} from "antd/es/form/Form";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";
import {useTranslation} from "react-i18next";

const {TextArea} = Input;

const ContentChargeUp: FC = (): ReactElement => {
    const bookKeepingSlice = useSelector((state: RootState) => state.bookKeeping)
    const initPaginationSize: number = 7
    const [total, setTotal] = useState<number>(0)
    const [page, setPage] = useState<number>(1)
    const [reRender, setReRender] = useState<boolean>(false)
    const [paginationSize, _] = useState<number>(initPaginationSize)
    const [typeOfOperation, setTypeOfOperation] = useState<UpdateOrDeleteEnum>(UpdateOrDeleteEnum.update)
    const [bookKeepingChoice, setBookKeepingChoice] = useState<IBookingBookKeeping>({} as IBookingBookKeeping)
    const [bookKeepingData, setBookKeepingData] = useState<IBookingBookKeeping[]>([])
    const [bookKeepingDataDisplay, setBookKeepingDataDisplay] = useState<IBookingBookKeepingDisplay[]>([])
    const [drawerStatus, setDrawerStatus] = useState(false);
    const [antdForm] = useForm()
    const {Column} = Table;
    const [t, i18n] = useTranslation();
    const topicSlice = useSelector((state: RootState) => state.topic);

    useEffect(() => {
        i18n.changeLanguage(topicSlice.internationalization ? "en" : "zh")
    }, [topicSlice.internationalization])

    const submitUpdateOrDelete = (payload: UpdateOrDeleteEnum) => {
        const bookKeepingObject: IBookingBookKeeping = antdForm.getFieldsValue() as IBookingBookKeeping
        antdForm.validateFields().then(async () => {
            switch (payload) {
                case UpdateOrDeleteEnum.create:
                    const responseCreate = await createBookKeepingService<BaseResponse<string>, IBookingBookKeeping>(bookKeepingObject);
                    if (responseCreate.code === 200) {
                        setReRender(!reRender)
                        setDrawerStatus(false)
                        message.success(responseCreate.data)
                    } else {
                        message.error(responseCreate.data)
                    }
                    break
                case UpdateOrDeleteEnum.delete:
                    const responseDelete = await deleteBookKeepingService<BaseResponse<string>>(bookKeepingObject.id)
                    if (responseDelete.code === 200) {
                        setReRender(!reRender)
                        setDrawerStatus(false)
                        message.success(responseDelete.data)
                    } else {
                        message.error(responseDelete.data)
                    }
                    break
                case UpdateOrDeleteEnum.update:
                    const responseUpdate = await updateBookKeepingService<BaseResponse<string>, IBookingBookKeeping>(bookKeepingObject)
                    if (responseUpdate.code === 200) {
                        setReRender(!reRender)
                        setDrawerStatus(false)
                        message.success(responseUpdate.data)
                    } else {
                        message.error(responseUpdate.data)
                    }
            }
        }).catch(() => {
            message.error("The field validation did not pass, please complete the field by prompting")
        })
    }

    useEffect(() => {
        setReRender(!reRender)
    }, [bookKeepingSlice])

    useEffect(() => {
        antdForm.resetFields()
    }, [bookKeepingChoice])


    useEffect(() => {
        getBookKeepingService<BaseResponse<IBookKeepingResponse<IBookingBookKeeping[]>>>(
            page, paginationSize
        ).then((data) => {
            setTotal(() => data.data.total)
            setBookKeepingData(() => data.data.records)
            setBookKeepingDataDisplay(() => {
                const tempBookKeepingArray: IBookingBookKeepingDisplay[] = []
                data.data.records.forEach((value: IBookingBookKeeping) => {
                    const tempBookKeepingObject: IBookingBookKeepingDisplay = {} as IBookingBookKeepingDisplay
                    tempBookKeepingObject.amountOfTransaction = value.amountOfTransaction
                    tempBookKeepingObject.modeOfTransaction = value.modeOfTransaction
                    tempBookKeepingObject.productDescription = value.productDescription
                    tempBookKeepingObject.tradeOrderNumber = value.tradeOrderNumber
                    tempBookKeepingObject.transactionClassification = value.transactionClassification
                    tempBookKeepingObject.key = value.tradeOrderNumber
                    tempBookKeepingArray.push(tempBookKeepingObject)
                })
                return tempBookKeepingArray
            })
        })
    }, [page, reRender])

    const validateAmountOfTransaction = (_: any, value: any) => {
        if (value <= 0) {
            return Promise.reject(new Error(t("The transaction amount must be a positive integer")));
        }
        return Promise.resolve()
    }

    return (
        <ConfigProvider theme={{
            algorithm: topicSlice.topic ? theme.defaultAlgorithm : theme.darkAlgorithm
        }}>
            <Fragment>
                <div className={contentChargeUp.chargeUpBox}>
                    <Table loading={bookKeepingSlice.tableReRenderStatus} onRow={(record) => {
                        return {
                            onMouseEnter: () => {
                                setBookKeepingChoice(() => {
                                    for (let i = 0; i < bookKeepingData.length; i++) {
                                        if ((bookKeepingData[i]).tradeOrderNumber === record.key) {
                                            return bookKeepingData[i]
                                        }
                                    }
                                    return {} as IBookingBookKeeping
                                })
                            }
                        }
                    }} dataSource={bookKeepingDataDisplay} expandable={{
                        expandedRowRender: () =>
                            <p style={{margin: 0}}>
                                {t("Transaction classification")}&nbsp;:&nbsp;{bookKeepingChoice.transactionClassification}
                                &nbsp;&nbsp;&nbsp;{t("counterparty")}&nbsp;:&nbsp;{bookKeepingChoice.counterparty}
                                &nbsp;&nbsp;&nbsp;&nbsp;{t("Transaction status")}:&nbsp;&nbsp;{bookKeepingChoice.transactionStatus}
                                &nbsp;&nbsp;&nbsp;&nbsp;{t("Product Description")}:&nbsp;&nbsp;{bookKeepingChoice.productDescription}
                                &nbsp;&nbsp;&nbsp;&nbsp;{`${t("income")}\\${t("disburse")}`}:&nbsp;&nbsp;{bookKeepingChoice.directionOfTrade === 0 ? t("income") : t("disburse")}
                            </p>
                    }} pagination={{pageSize: paginationSize, total: total}}
                           onChange={page => setPage(page.current as number)}>
                        <Column className={contentChargeUp.overflow} title={t("Order number")}
                                dataIndex="tradeOrderNumber"
                                key="tradeOrderNumber" align="center"/>
                        <Column width={100} title={t("Order classification")} dataIndex="transactionClassification"
                                align="center"/>
                        <Column className={contentChargeUp.overflow} title={t("Trade description")}
                                dataIndex="productDescription"
                                align="center"/>
                        <Column width={100} title={t("Transaction amount")} dataIndex="amountOfTransaction"
                                align="center"/>
                        <Column className={contentChargeUp.overflow} title={t("Payment method")}
                                dataIndex="modeOfTransaction"
                                align="center"/>
                        <Column
                            title={t("Controls")}
                            key="action"
                            align="center"
                            render={(_: any) => (
                                <Space size="middle">
                                    <Button type="primary" onClick={() => {
                                        setDrawerStatus(true)
                                        setTypeOfOperation(UpdateOrDeleteEnum.update)
                                    }}>{t("edit")}</Button>
                                    <Button danger type="dashed" onClick={() => {
                                        setDrawerStatus(true)
                                        setTypeOfOperation(UpdateOrDeleteEnum.delete)
                                    }}>{t("delete")}</Button>
                                </Space>
                            )}
                        />
                    </Table>
                </div>
                <FloatButton type="primary" tooltip={<div>{t("append")}</div>} icon={<PlusOutlined/>} onClick={() => {
                    setDrawerStatus(true)
                    setTypeOfOperation(UpdateOrDeleteEnum.create)
                    setBookKeepingChoice({} as IBookingBookKeeping)
                }}/>
                <Drawer title={t(`${typeOfOperation}`)} onClose={() => setDrawerStatus(false)} open={drawerStatus}
                        width={400}>
                    <Form
                        labelCol={{span: 8}}
                        wrapperCol={{span: 16}}
                        layout="horizontal"
                        style={{maxWidth: 400}}
                        form={antdForm}
                    >
                        <Form.Item label={t("identification")}
                                   tooltip={t("The unique identifier is encrypted from the purchase order number of the group of consumption records and cannot be modified")}
                                   name="id"
                                   initialValue={bookKeepingChoice.id}>
                            <Input disabled={true}/>
                        </Form.Item>
                        <Form.Item label={t("Transaction status")}
                                   rules={[{required: true, message: t("The transaction status cannot be empty")}]}
                                   name="transactionStatus"
                                   initialValue={bookKeepingChoice.transactionStatus}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label={t("Product classification")}
                                   rules={[{required: true, message: t("The transaction class cannot be empty")}]}
                                   name="transactionClassification"
                                   initialValue={bookKeepingChoice.transactionClassification}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label={t("counterparty")}
                                   rules={[{required: true, message: t("The counterparty cannot be short")}]}
                                   name="counterparty"
                                   initialValue={bookKeepingChoice.counterparty}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label={t("Description")} name="productDescription"
                                   initialValue={bookKeepingChoice.productDescription}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label={t("direction")} tooltip={t("0 is income and 1 is expenditure")}
                                   name="directionOfTrade"
                                   rules={[{
                                       required: true,
                                       message: t("The trading direction cannot be null and can only be 0 or 1")
                                   },
                                       {
                                           validator: (_, value) => {
                                               if (parseInt(value) !== 0 && parseInt(value) !== 1) {
                                                   return Promise.reject(new Error(t("The trading direction cannot be null and can only be 0 or 1")))
                                               }
                                               return Promise.resolve()
                                           }
                                       },
                                   ]}
                                   initialValue={bookKeepingChoice.directionOfTrade}>
                            <Input type="number"/>
                        </Form.Item>
                        <Form.Item label={t("Amount")} name="amountOfTransaction"
                                   rules={[{validator: validateAmountOfTransaction}, {
                                       required: true,
                                       message: t("The transaction amount cannot be empty")
                                   }]}
                                   initialValue={bookKeepingChoice.amountOfTransaction}>
                            <Input type="number"/>
                        </Form.Item>
                        <Form.Item label={t("transaction")} name="modeOfTransaction"
                                   initialValue={bookKeepingChoice.modeOfTransaction}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label={t("order number")} name="tradeOrderNumber"
                                   rules={[{required: true, message: t("The order number cannot be empty")}]}
                                   initialValue={bookKeepingChoice.tradeOrderNumber}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label={t("Trading hours")} name="tradingHours">
                            <DatePicker/>
                        </Form.Item>
                        <Form.Item label={t("Remarks")} name="remarks" initialValue={bookKeepingChoice.remarks}>
                            <TextArea rows={4}/>
                        </Form.Item>
                        {
                            typeOfOperation === UpdateOrDeleteEnum.update || typeOfOperation === UpdateOrDeleteEnum.create ?
                                <Button type="primary" block
                                        onClick={() => submitUpdateOrDelete(typeOfOperation)}>{t("Submit")}</Button> :
                                <Button danger type="primary" block
                                        onClick={() => submitUpdateOrDelete(typeOfOperation)}>{t("delete")}</Button>
                        }
                    </Form>
                </Drawer>
            </Fragment>
        </ConfigProvider>
    )
}

export default ContentChargeUp