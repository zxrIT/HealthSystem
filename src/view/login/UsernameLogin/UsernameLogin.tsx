import {FC, Fragment, ReactElement, useEffect} from "react"
import {Form, Input, message} from 'antd';
import {useForm} from "antd/es/form/Form";
import {passwordLoginService} from "../../../service/loginService";
import {BaseResponse} from "../../../typing/response/baseResponse.ts";
import {LoginPasswordRequest, LoginPasswordResponse} from "../../../typing/login/passwodLogin.ts";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {useLocalStorage} from "../../../hooks/useLocalStorage.ts";

type FieldType = {
    username?: string;
    password?: string;
};

interface IProps {
    status: boolean;
}

const UsernameLogin: FC<IProps> = ({status}): ReactElement => {
    const {setStorage} = useLocalStorage()
    const navigateFunction: NavigateFunction = useNavigate();
    const [antdForm] = useForm();
    useEffect(() => {
        if (!status) return;
        antdForm.validateFields().then(async () => {
            const passwordLoginResponse = await passwordLoginService<BaseResponse<LoginPasswordResponse | string>, LoginPasswordRequest>(antdForm.getFieldsValue())
            if (passwordLoginResponse.code === 200) {
                message.success("登录成功")
                setStorage("user", JSON.stringify(passwordLoginResponse.data))
                setStorage("authentication", JSON.stringify(((passwordLoginResponse.data) as LoginPasswordResponse).token))
                navigateFunction("/home")
            } else {
                message.error(passwordLoginResponse.data as string)
            }
        }).catch(() => {
            message.success("请根据提示完成填写后再提交登录")
        })
    }, [status]);

    return (
        <Fragment>
            <Form
                name="basic"
                labelCol={{span: 8}}
                wrapperCol={{span: 22}}
                style={{maxWidth: 500}}
                initialValues={{remember: true}}
                autoComplete="off"
                form={antdForm}
            >
                <Form.Item<FieldType>
                    name="username"
                    style={{marginLeft: 40}}
                    rules={[{required: true, message: '请输入用户名'}]}
                >
                    <Input style={{height: 40}} placeholder="请输入用户名"/>
                </Form.Item>
                <Form.Item<FieldType>
                    name="password"
                    style={{marginLeft: 40}}
                    rules={[{required: true, message: '请输入密码'}]}
                >
                    <Input.Password style={{height: 40}} placeholder="请输入密码"/>
                </Form.Item>
            </Form>
        </Fragment>
    )
}

export default UsernameLogin