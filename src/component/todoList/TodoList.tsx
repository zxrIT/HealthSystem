import {FC, ReactElement, useEffect} from "react"
import classStyle from "./TodoList.module.less"
import {Form, Input, Tooltip} from "antd";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {TwitterOutlined} from '@ant-design/icons';
import type {CollapseProps} from 'antd';
import {Collapse} from 'antd';

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const TodoList: FC = (): ReactElement => {
    const [t, i18n] = useTranslation();
    const topicSlice = useSelector((state: RootState) => state.topic);

    useEffect(() => {
        i18n.changeLanguage(topicSlice.internationalization ? "en" : "zh")
    }, [topicSlice.internationalization])

    const genExtra = (): ReactElement => (
        <Tooltip title={t("Email reminder")}>
            <TwitterOutlined
                onClick={(event) => {
                    event.stopPropagation();
                }}
            />
        </Tooltip>
    );

    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: 'This is panel header 1',
            children: <div>{text}</div>,
            extra: genExtra(),
        },
        {
            key: '2',
            label: 'This is panel header 2',
            children: <div>{text}</div>,
            extra: genExtra(),
        },
        {
            key: '3',
            label: 'This is panel header 3',
            children: <div>{text}</div>,
            extra: genExtra(),
        },
        {
            key: '4',
            label: 'This is panel header 3',
            children: <div>{text}</div>,
            extra: genExtra(),
        },
        {
            key: '5',
            label: 'This is panel header 3',
            children: <div>{text}</div>,
            extra: genExtra(),
        },
        {
            key: '6',
            label: 'This is panel header 3',
            children: <div>{text}</div>,
            extra: genExtra(),
        },
    ];

    return (
        <div className={classStyle.TodoListBox}>
            <div className={classStyle.todoListInput}>
                <Form labelCol={{span: 6}}
                      wrapperCol={{span: 21}}>
                    <Tooltip title={t("Enter add ")}>
                        <Form.Item>
                            <Input placeholder={t("Agent matters")}/>
                        </Form.Item>
                    </Tooltip>
                </Form>
            </div>
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
        </div>
    )
}

export default TodoList