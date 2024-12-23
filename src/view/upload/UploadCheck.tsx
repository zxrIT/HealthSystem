import uploadAli from "./UploadCheck.module.less"
import {FC, ReactElement, useEffect, useState} from "react"
import {Button, Form, Input, message, Upload} from 'antd';
import type {GetProp, UploadFile, UploadProps} from 'antd';
import {Upload as UploadEnum} from "../../typing/enum";
import {useForm} from "antd/es/form/Form";
import {UploadOutlined} from "@ant-design/icons";
import {IUploadCsv} from "../../typing/upload/upload.ts";
import {useDispatch} from "react-redux";
import {changeTableReRenderStatus} from "../../store/slice/bookKeepingSlice.ts";
import {BaseResponse} from "../../typing/response/baseResponse.ts";
import {IUploadResult} from "../../typing/response/bookKeepingResponse";
import {useSelector} from "react-redux";
import {RootState} from "../../store";

interface IProps {
    uploadTitle: string,
    uploadType: UploadEnum,
    changeDrawerStatus: (status: boolean) => void
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const {TextArea} = Input;

const UploadCheck: FC<IProps> = ({uploadTitle, uploadType, changeDrawerStatus}): ReactElement => {
    const dispatch = useDispatch()
    const userSlice = useSelector((state: RootState) => state.user)
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploadId, setUploadId] = useState<string>("");
    const [selectStatus, setSelectStatus] = useState<boolean>(true)
    const [uploadEndStatus, setUploadEndStatus] = useState<boolean>(false);
    const [uploading, setUploading] = useState(false);
    const [antdForm] = useForm()

    useEffect(() => {
        if (typeof (WebSocket) === "undefined") {
            message.error("您的浏览器版本太低请使用新版的浏览器")
        }
    }, []);

    useEffect(() => {
        if (uploadId.length === 0) return
        const websocket = new WebSocket("ws://localhost:8040/upload/csv/status");
        websocket.onopen = () => {
            console.log("websocket open");
        }
        const timer = setTimeout(() => {
            if (!uploadEndStatus) {
                dispatch(changeTableReRenderStatus(false));
                message.error("数据处理失败请稍后重试");
                changeDrawerStatus(false)
            }
            websocket.close()
        }, 10000)

        const sendMessageTimer = setInterval(() => {
            websocket.send(uploadId)
        }, 1000)

        websocket.onmessage = event => {
            if (event.data === "yes") {
                dispatch(changeTableReRenderStatus(false));
                websocket.close()
                clearInterval(timer)
                clearInterval(sendMessageTimer)
                setUploadEndStatus(true)
                changeDrawerStatus(false)
                message.success("数据处理成功")
            } else if (event.data === "error") {
                dispatch(changeTableReRenderStatus(false));
                message.error("服务器异常请稍后重试");
                changeDrawerStatus(false)
            }
        }
    }, [uploadId]);


    const handleUpload =() => {
        const uploadObject: IUploadCsv = antdForm.getFieldsValue()
        antdForm.validateFields().then(async () => {
            const formData = new FormData();
            fileList.forEach((file) => {
                formData.append('file', file as FileType);
            });
            setUploading(true);
            fetch('http://localhost:10000/upload/csv/'
                + uploadObject.username + "/" + userSlice.user.id + "/" +
                (uploadObject.notesOnBills === undefined ? "upload" : uploadObject.notesOnBills), {
                method: 'POST',
                headers: {
                    'Authorization': userSlice.user.token
                },
                body: formData,
            }).then((res) => res.json())
                .then((response: BaseResponse<IUploadResult>) => {
                    if (response.code === 200) {
                        setFileList([]);
                        dispatch(changeTableReRenderStatus(true));
                        message.success(response.data.uploadMessage);
                        setUploadId(response.data.uploadId);
                    } else {
                        message.error(response.data.uploadMessage);
                    }
                }).catch(error => {
                console.log(error);
            }).finally(() => {
                setUploading(false);
            })
        })
    };


    useEffect(() => {
        console.log(uploadType)
    }, [uploadType])

    const props: UploadProps = {
        onRemove: (file) => {
            setSelectStatus(true)
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            setSelectStatus(false);
            setFileList([...fileList, file]);
            return false;
        },
        fileList,
    };

    return (
        <div className={uploadAli.uploadBox}>
            <div className={uploadAli.navigate}>{uploadTitle}</div>
            <div className={uploadAli.uploadForm}>
                <Form
                    labelCol={{span: 6}}
                    wrapperCol={{span: 18}}
                    layout="horizontal"
                    labelWrap
                    form={antdForm}
                    style={{maxWidth: "100%"}}
                >
                    <Form.Item label="提交人"
                               rules={[{required: true, message: "提交人不能为空"}]}
                               name="username">
                        <Input/>
                    </Form.Item>
                    <Form.Item label="账单备注" name="notesOnBills">
                        <TextArea rows={4}/>
                    </Form.Item>
                    <Form.Item label="上传文件">
                        <Upload {...props}>
                            <Button icon={<UploadOutlined/>}
                                    disabled={!selectStatus}>选择文件</Button>
                        </Upload>
                    </Form.Item>
                </Form>
                <Button
                    type="primary"
                    onClick={handleUpload}
                    disabled={fileList.length === 0}
                    loading={uploading}
                    style={{marginTop: 16}}
                    block
                >
                    {uploading ? '正在上传' : '上传'}
                </Button>
            </div>
        </div>
    )
}

export default UploadCheck