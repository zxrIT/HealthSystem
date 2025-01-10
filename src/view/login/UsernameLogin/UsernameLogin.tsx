import {FC, Fragment, ReactElement, useEffect} from "react"
import classModule from "./UsernameLogin.module.less"
import {ConfigProvider, Form, Input, message, theme} from 'antd';
import {useForm} from "antd/es/form/Form";
import {passwordLoginService} from "../../../service/loginService";
import {BaseResponse} from "../../../typing/response/baseResponse.ts";
import {LoginPasswordRequest, LoginPasswordResponse} from "../../../typing/login/passwodLogin.ts";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {useLocalStorage} from "../../../hooks/useLocalStorage.ts";
import {useDispatch, useSelector} from "react-redux";
import {initUser} from "../../../store/slice/UserSlice.ts";
import {IUser} from "../../../typing/user/user.ts";
import {RootState} from "../../../store";
import {useTranslation} from "react-i18next";

type FieldType = {
    username?: string;
    password?: string;
};

interface IProps {
    status: boolean;
}

const UsernameLogin: FC<IProps> = ({status}): ReactElement => {
    const topicSlice = useSelector((state: RootState) => state.topic)
    const [t, i18n] = useTranslation()
    const dispatch = useDispatch()
    const {setStorage} = useLocalStorage()
    const navigateFunction: NavigateFunction = useNavigate();
    const [antdForm] = useForm();

    useEffect(() => {
        i18n.changeLanguage(topicSlice.internationalization ? "en" : "zh")
    }, [topicSlice.internationalization])

    useEffect(() => {
        if (!status) return;
        antdForm.validateFields().then(async () => {
            const passwordLoginResponse = await passwordLoginService<BaseResponse<LoginPasswordResponse | string>, LoginPasswordRequest>(antdForm.getFieldsValue())
            if (passwordLoginResponse.code === 200) {
                message.success(t("Login successful"))
                dispatch(initUser((passwordLoginResponse.data) as IUser))
                setStorage("user", JSON.stringify(passwordLoginResponse.data))
                setStorage("authentication", JSON.stringify(((passwordLoginResponse.data) as LoginPasswordResponse).token))
                navigateFunction("/home")
            } else {
                message.error(passwordLoginResponse.data as string)
            }
        }).catch(() => {
            message.success(t("Please follow the prompts to complete the filling and submit the login"))
        })
    }, [status]);

    return (
        <ConfigProvider theme={{algorithm: topicSlice.topic ? theme.defaultAlgorithm : theme.darkAlgorithm}}>
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
                        rules={[{required: true, message: t("Please enter your username")}]}
                    >
                        <Input className={topicSlice.topic ? "" : classModule.input} style={{
                            height: 40,
                            transition: "color 1s background-color 1s"
                        }}
                               placeholder={t("Please enter your username")}/>
                    </Form.Item>
                    <Form.Item<FieldType>
                        name="password"
                        style={{marginLeft: 40}}
                        rules={[{required: true, message: t("Please enter your password")}]}
                    >
                        <Input.Password
                            style={{
                                height: 40,
                                transition: "color 1s background-color 1s"
                            }} className={topicSlice.topic ? "" : classModule.input}
                            placeholder={t("Please enter your password")}/>
                    </Form.Item>
                </Form>
            </Fragment>
        </ConfigProvider>
    )
}

export default UsernameLogin