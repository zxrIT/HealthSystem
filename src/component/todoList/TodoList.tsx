import {FC, ReactElement, useEffect, useState} from "react"
import classStyle from "./TodoList.module.less"
import {Form, Input, message, Modal, Select, Tooltip} from "antd";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {TwitterOutlined} from '@ant-design/icons';
import type {CollapseProps} from 'antd';
import {Collapse} from 'antd';
import {getTodoService, incrementTodoService, sendEmailService} from "../../service/todoList";
import {BaseResponse} from "../../typing/response/baseResponse.ts";
import {ITodoList} from "../../typing/todoList";
import {format} from "date-fns";
import Regex from "../../util/Regex.ts";

class Todo {
    private readonly content: string;
    private readonly createTime: Date;
    private readonly status: number

    public get getStatus(): number {
        return this.status;
    }

    public get getContent(): string {
        return this.content
    }

    public get getCreateTime(): Date {
        return this.createTime
    }

    public constructor(content: string, createTime: Date, status: number) {
        this.content = content;
        this.createTime = createTime;
        this.status = status;
    }
}


const TodoList: FC = (): ReactElement => {
    const [t, i18n] = useTranslation();
    const topicSlice = useSelector((state: RootState) => state.topic);
    const [reRender, setReRender] = useState<boolean>(false);
    const user = useSelector((state: RootState) => state.user);
    const [items, setItems] = useState<CollapseProps['items']>()
    const [todoListArray, setTodoListArray] = useState<ITodoList[]>([])
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [sendTodo, setSendTodo] = useState<string>()
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        getTodoService<BaseResponse<ITodoList[]>>().then((response) => {
            setItems(() => {
                setTodoListArray(response.data)
                return response.data.map((todo) => {
                    const preTimer: string = format(new Date(todo.createTime), "HH:mm:ss")
                    return {
                        key: todo.id,
                        label: `创建人（${user.user.username}）（${preTimer}时创建）`,
                        children: <div>{todo.content}</div>,
                        extra: genExtra(),
                    }
                })
            })
        })
    }, [reRender]);

    const genExtra = (): ReactElement => (
        <Tooltip title={t("Email reminder")}>
            <TwitterOutlined
                onClick={(event) => {
                    if (Regex.regexIdentityCard.test(user.user.identityCard) &&
                        Regex.regexMobile.test(user.user.mobile) && Regex.regexEmail.test(user.user.email)) {
                        showModal()
                    } else {
                        message.error(t("Please authenticate your real name before using it"))
                    }
                    event.stopPropagation();
                }}
            />
        </Tooltip>
    );


    const submitTodo = async (todo: string) => {
        const userTodo = new Todo(todo, new Date(), 0);
        const response = await incrementTodoService<BaseResponse<string>, Todo>(userTodo)
        if (response.code === 200) {
            message.success(response.data)
            setReRender(!reRender);
        } else {
            message.success(response.data)
        }
    }

    useEffect(() => {
        i18n.changeLanguage(topicSlice.internationalization ? "en" : "zh")
    }, [topicSlice.internationalization])

    return (
        <div className={classStyle.TodoListBox}>
            <Modal title={t("Confirm sending agent reminder to") + `    ${user.user.email}`}
                   confirmLoading={confirmLoading} onCancel={handleCancel}
                   open={isModalOpen} onOk={async () => {
                if (sendTodo && sendTodo!.trim().length > 0) {
                    setConfirmLoading(true)
                    const response = await sendEmailService<BaseResponse<string>>(user.user.email, sendTodo!)
                    if (response === void 0) {
                        message.error(t("Failure to send"))
                    }
                    if (response.code === 200) {
                        message.success(response.data)
                    }
                    setSendTodo("")
                    setConfirmLoading(false)
                } else {
                    message.error("请选择代办后再发送")
                }
            }
            }>
                <div>
                    <Select
                        defaultValue=""
                        style={{width: 240}}
                        onChange={(value) => {
                            setSendTodo(value)
                        }}
                        options={
                            todoListArray && todoListArray.map((item) => {
                                return {
                                    value: item.content,
                                    label: item.content
                                }
                            })
                        }
                    />
                </div>
            </Modal>
            <div className={classStyle.todoListInput}>
                <Form labelCol={{span: 6}}
                      wrapperCol={{span: 21}}>
                    <Tooltip title={t("Enter add ")}>
                        <Form.Item>
                            <Input placeholder={t("Agent matters")} onKeyUp={(event) => {
                                if (event.key === "Enter") {
                                    if ((event.target as HTMLInputElement).value.length > 0) {
                                        submitTodo((event.target as HTMLInputElement).value.trim());
                                    } else {
                                        message.error(t("Please fill in the information before submitting"))
                                    }
                                }
                            }}/>
                        </Form.Item>
                    </Tooltip>
                </Form>
            </div>
            <Tooltip title={t("The to-do items will be automatically deleted after 24:00 every day")}>
                <div className={classStyle.todoList}>
                    <Collapse
                        items={items}
                        style={{
                            height: 300,
                            width: 350,
                            overflowY: 'auto'
                        }}
                    />

                </div>
            </Tooltip>
        </div>
    )
}

export default TodoList