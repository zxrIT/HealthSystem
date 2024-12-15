import type {FC, ReactElement} from "react"
import {Fragment, useEffect, useState} from "react"
import {Button, DatePicker, Drawer, FloatButton, Form, Input, message, Space, Table} from 'antd';
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

const {TextArea} = Input;

const ContentChargeUp: FC = (): ReactElement => {
    const initPaginationSize: number = 7
    const [total, setTotal] = useState<number>(0)
    const [page, setPage] = useState<number>(1)
    const [reRender, setReRender] = useState<boolean>(false)
    const [paginationSize, setPaginationSize] = useState<number>(initPaginationSize)
    const [typeOfOperation, setTypeOfOperation] = useState<UpdateOrDeleteEnum>(UpdateOrDeleteEnum.update)
    const [bookKeepingChoice, setBookKeepingChoice] = useState<IBookingBookKeeping>({} as IBookingBookKeeping)
    const [bookKeepingData, setBookKeepingData] = useState<IBookingBookKeeping[]>([])
    const [bookKeepingDataDisplay, setBookKeepingDataDisplay] = useState<IBookingBookKeepingDisplay[]>([])
    const [drawerStatus, setDrawerStatus] = useState(false);
    const [antdForm] = useForm()
    const {Column} = Table;

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
            message.error("字段校验没有通过，请通过提示完成字段填写")
        })
    }
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
            return Promise.reject(new Error('交易金额必须为正整数'));
        }
        return Promise.resolve()
    }

    return (
        <Fragment>
            <div className={contentChargeUp.chargeUpBox}>
                <Table onRow={(record) => {
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
                            交易分类&nbsp;:&nbsp;{bookKeepingChoice.transactionClassification}
                            &nbsp;&nbsp;&nbsp;交易方&nbsp;:&nbsp;{bookKeepingChoice.counterparty}
                            &nbsp;&nbsp;&nbsp;&nbsp;交易状态:&nbsp;&nbsp;{bookKeepingChoice.transactionStatus}
                            &nbsp;&nbsp;&nbsp;&nbsp;商品说明:&nbsp;&nbsp;{bookKeepingChoice.productDescription}
                            &nbsp;&nbsp;&nbsp;&nbsp;收/支:&nbsp;&nbsp;{bookKeepingChoice.directionOfTrade === 0 ? "收入" : "支出"}
                        </p>
                }} pagination={{pageSize: paginationSize, total: total}} onExpand={() => {
                    setPaginationSize(paginationSize ===
                        initPaginationSize ? initPaginationSize - 1 : initPaginationSize
                    )
                }} onChange={page => setPage(page.current as number)}>
                    <Column title="交易单号" dataIndex="tradeOrderNumber" key="tradeOrderNumber" align="center"/>
                    <Column width={100} title="交易分类" dataIndex="transactionClassification" align="center"/>
                    <Column title="商品说明" dataIndex="productDescription" align="center"/>
                    <Column width={100} title="交易金额" dataIndex="amountOfTransaction" align="center"/>
                    <Column title="付款方式" dataIndex="modeOfTransaction" align="center"/>
                    <Column
                        title="操作"
                        key="action"
                        align="center"
                        render={(_: any) => (
                            <Space size="middle">
                                <Button type="primary" onClick={() => {
                                    setDrawerStatus(true)
                                    setTypeOfOperation(UpdateOrDeleteEnum.update)
                                }}>修改</Button>
                                <Button danger type="dashed" onClick={() => {
                                    setDrawerStatus(true)
                                    setTypeOfOperation(UpdateOrDeleteEnum.delete)
                                }}>删除</Button>
                            </Space>
                        )}
                    />
                </Table>
            </div>
            <FloatButton type="primary" tooltip={<div>添加</div>} icon={<PlusOutlined/>} onClick={() => {
                setDrawerStatus(true)
                setTypeOfOperation(UpdateOrDeleteEnum.create)
                setBookKeepingChoice({} as IBookingBookKeeping)
            }}/>
            <Drawer title={typeOfOperation} onClose={() => setDrawerStatus(false)} open={drawerStatus} width={400}>
                <Form
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                    layout="horizontal"
                    style={{maxWidth: 400}}
                    form={antdForm}
                >
                    <Form.Item label="交易单唯一标识"
                               tooltip="由该组消费记录的消费单号加密而来唯一标识，不可修改" name="id"
                               initialValue={bookKeepingChoice.id}>
                        <Input disabled={true}/>
                    </Form.Item>
                    <Form.Item label="交易状态" rules={[{required: true, message: "交易状态不能为空"}]}
                               name="transactionStatus"
                               initialValue={bookKeepingChoice.transactionStatus}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="交易分类" rules={[{required: true, message: "交易分类不能为空"}]}
                               name="transactionClassification"
                               initialValue={bookKeepingChoice.transactionClassification}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="交易对方"
                               rules={[{required: true, message: "交易对方不能为空"}]}
                               name="counterparty"
                               initialValue={bookKeepingChoice.counterparty}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="商品描述" name="productDescription"
                               initialValue={bookKeepingChoice.productDescription}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="交易方向" tooltip="0为收入 1为支出"
                               name="directionOfTrade"
                               rules={[{required: true, message: "交易方向不能为空且只能为0或1"},
                                   {
                                       validator: (_, value) => {
                                           if (parseInt(value) !== 0 && parseInt(value) !== 1) {
                                               return Promise.reject(new Error("交易方向只能为0或1"))
                                           }
                                           return Promise.resolve()
                                       }
                                   },
                               ]}
                               initialValue={bookKeepingChoice.directionOfTrade}>
                        <Input type="number"/>
                    </Form.Item>
                    <Form.Item label="交易金额" name="amountOfTransaction"
                               rules={[{validator: validateAmountOfTransaction}, {
                                   required: true,
                                   message: "交易金额不能为空"
                               }]}
                               initialValue={bookKeepingChoice.amountOfTransaction}>
                        <Input type="number"/>
                    </Form.Item>
                    <Form.Item label="交易方式" name="modeOfTransaction"
                               initialValue={bookKeepingChoice.modeOfTransaction}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="交易单号" name="tradeOrderNumber"
                               rules={[{required: true, message: "交易单号不能为空"}]}
                               initialValue={bookKeepingChoice.tradeOrderNumber}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="交易时间" name="tradingHours">
                        <DatePicker/>
                    </Form.Item>
                    <Form.Item label="交易备注" name="remarks" initialValue={bookKeepingChoice.remarks}>
                        <TextArea rows={4}/>
                    </Form.Item>
                    {
                        typeOfOperation === UpdateOrDeleteEnum.update || typeOfOperation === UpdateOrDeleteEnum.create ?
                            <Button type="primary" block
                                    onClick={() => submitUpdateOrDelete(typeOfOperation)}>提交</Button> :
                            <Button danger type="primary" block
                                    onClick={() => submitUpdateOrDelete(typeOfOperation)}>删除</Button>
                    }
                </Form>
            </Drawer>
        </Fragment>
    )
}

export default ContentChargeUp