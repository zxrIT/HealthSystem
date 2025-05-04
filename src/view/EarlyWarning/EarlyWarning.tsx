import {useEffect, useState} from "react"
import classNames from "./EarlyWarning.module.less"
import {Card, theme, ConfigProvider, Form, Button, Space, message, InputNumber, Modal} from "antd"
import type {FC, ReactElement} from "react"
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {useTranslation} from "react-i18next"
import {changeSalaryService, changeThresholdService, getUserService, sendMessageService} from "../../service/waring";
import {BaseResponse} from "../../typing/response/baseResponse.ts";
import {IUser} from "../../typing/user/user.ts";

type FieldType = {
    salary?: number;
    threshold?: number;
};

const EarlyWarning: FC = (): ReactElement => {
    const {t} = useTranslation();
    const topicSlice = useSelector((state: RootState) => state.topic);
    const [form] = Form.useForm();
    const [salary, setSalary] = useState<number | null>(null);
    const [threshold, setThreshold] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [userEmail, setUserEmail] = useState<string>('');

    const sendEmail = async () => {
        try {
            setLoading(true);
            message.loading('正在发送预警邮件...', 1);
            sendMessageService<BaseResponse<any>>().then((response) => {
                if (response.code === 200) {
                    message.success(`预警邮件已发送至 ${userEmail}`);
                    setLoading(false);
                    setIsModalVisible(false);
                }
            })
        } catch (error) {
            message.error('发送预警邮件时出错');
            setLoading(false);
        }
    };

    const showConfirmModal = () => {
        if (!userEmail) {
            message.warning('您尚未绑定邮箱，请先在个人设置中绑定邮箱后再使用预警功能');
            return;
        }
        setIsModalVisible(true);
    };

    // 获取用户数据和结余信息
    useEffect(() => {
        setLoading(true);

        // 获取用户信息
        getUserService<BaseResponse<IUser>>().then((response: BaseResponse<IUser>) => {
            if (response.code === 200) {
                // 设置用户工资和阈值到输入框
                if (response.data.salary !== undefined) {
                    setSalary(response.data.salary);
                    form.setFieldsValue({salary: response.data.salary});
                }

                if (response.data.threshold !== undefined) {
                    setThreshold(response.data.threshold);
                    form.setFieldsValue({threshold: response.data.threshold});
                }

                // 保存用户邮箱
                if (response.data.email) {
                    setUserEmail(response.data.email);
                }

                console.log("获取到用户数据:", response.data);
            }
            setLoading(false);
        }).catch((error: Error) => {
            console.error("获取用户信息失败:", error);
            setLoading(false);
        });
    }, [form]);

    // 处理工资输入变化
    const handleSalaryInputChange = (value: number | null) => {
        setSalary(value);
    };

    // 处理阈值输入变化
    const handleThresholdInputChange = (value: number | null) => {
        setThreshold(value);
    };

    // 保存工资数据
    const saveSalary = async () => {
        if (salary === null) {
            message.warning('请输入工资数据');
            return;
        }

        try {
            const response = await changeSalaryService<BaseResponse<any>>(salary);
            if (response.code === 200) {
                message.success('工资数据已保存');
                console.log('收集的工资数据:', salary);
            } else {
                message.error('保存工资数据失败');
            }
        } catch (error) {
            message.error('保存工资数据时发生错误');
            console.error(error);
        }
    };

    // 保存阈值数据
    const saveThreshold = async () => {
        if (threshold === null) {
            message.warning('请输入阈值数据');
            return;
        }

        try {
            const response = await changeThresholdService<BaseResponse<any>>(threshold);
            if (response.code === 200) {
                message.success('阈值数据已保存');
                console.log('收集的阈值数据:', threshold);
            } else {
                message.error('保存阈值数据失败');
            }
        } catch (error) {
            message.error('保存阈值数据时发生错误');
            console.error(error);
        }
    };

    return (
        <ConfigProvider theme={{
            algorithm: topicSlice.topic ? theme.defaultAlgorithm : theme.darkAlgorithm
        }}>
            <div className={classNames.warningBox}>
                <Card title={t("Parameter setting of early warning function")}
                      style={{width: "100%", height: "100%"}}>
                    <Form
                        name="basic"
                        labelCol={{span: 8}}
                        wrapperCol={{span: 16}}
                        style={{maxWidth: 600}}
                        autoComplete="off"
                        form={form}
                    >
                        <Form.Item<FieldType>
                            label="工资"
                            name="salary"
                        >
                            <Space.Compact style={{width: '100%'}}>
                                <InputNumber
                                    style={{width: 'calc(100% - 70px)'}}
                                    value={salary}
                                    onChange={handleSalaryInputChange}
                                    placeholder="请输入工资"
                                    precision={2}
                                    min={0}
                                    prefix="￥"
                                    disabled={loading}
                                />
                                <Button type="primary" onClick={saveSalary} disabled={loading}>修改</Button>
                            </Space.Compact>
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="阈值"
                            name="threshold"
                        >
                            <Space.Compact style={{width: '100%'}}>
                                <InputNumber
                                    style={{width: 'calc(100% - 70px)'}}
                                    value={threshold}
                                    onChange={handleThresholdInputChange}
                                    placeholder="请输入阈值"
                                    precision={2}
                                    min={0}
                                    disabled={loading}
                                />
                                <Button type="primary" onClick={saveThreshold} disabled={loading}>修改</Button>
                            </Space.Compact>
                        </Form.Item>

                        <Form.Item wrapperCol={{offset: 8, span: 16}}>
                            <Button
                                onClick={showConfirmModal}
                                type="primary"
                                danger
                                style={{marginTop: 16}}
                                disabled={loading || !userEmail}
                                title={!userEmail ? "请先绑定邮箱才能使用预警功能" : "发送预警邮件"}
                            >
                                {!userEmail ? "请先绑定邮箱" : "手动预警"}
                            </Button>
                        </Form.Item>
                    </Form>

                    <Modal
                        title="预警确认"
                        open={isModalVisible}
                        onOk={sendEmail}
                        onCancel={() => setIsModalVisible(false)}
                        okText="确认发送"
                        cancelText="取消"
                        confirmLoading={loading}
                    >
                        <p>确认向您的邮箱 <strong>{userEmail}</strong> 发送预警邮件吗？</p>
                        <p>预警邮件将包含您的账户消费情况和预警信息。</p>
                    </Modal>
                </Card>
            </div>
        </ConfigProvider>
    )
}

export default EarlyWarning