import uploadAli from "./UploadCheck.module.less"
import {FC, ReactElement, useEffect, useState} from "react"
import {GetProp, UploadFile, UploadProps} from 'antd';
import {Button, Form, Input, message, Upload} from 'antd';
import {Upload as UploadEnum} from "../../typing/enum";
import {useForm} from "antd/es/form/Form";
import {UploadOutlined} from "@ant-design/icons";
import {IUploadCsv} from "../../typing/upload/upload.ts";
import {useDispatch, useSelector} from "react-redux";
import {changeTableReRenderStatus} from "../../store/slice/bookKeepingSlice.ts";
import {BaseResponse} from "../../typing/response/baseResponse.ts";
import {IUploadResult} from "../../typing/response/bookKeepingResponse";
import {RootState} from "../../store";
import {useTranslation} from "react-i18next";

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
    const [t, i18n] = useTranslation();
    const topicSlice = useSelector((state: RootState) => state.topic);

    useEffect(() => {
        i18n.changeLanguage(topicSlice.internationalization ? "en" : "zh")
    }, [topicSlice.internationalization])

    useEffect(() => {
        if (typeof (WebSocket) === "undefined") {
            message.error(t("Your browser version is too low. Please use a newer browser"))
        }
    }, []);

    useEffect(() => {
        if (uploadId.length === 0) return
        const websocket = new WebSocket(import.meta.env.VITE_UPLOAD_STATUS_WEBSOCKET_URL);
        websocket.onopen = () => {
            console.log("websocket open");
        }
        const timer = setTimeout(() => {
            if (!uploadEndStatus) {
                dispatch(changeTableReRenderStatus(false));
                message.error(t("Data processing failed. Please try again later"));
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
                message.success(t("Data processing was successful"))
            } else if (event.data === "error") {
                dispatch(changeTableReRenderStatus(false));
                message.error(t("Server exception Please try again later"));
                changeDrawerStatus(false)
            }
        }
    }, [uploadId]);


    const handleUpload = () => {
        const uploadObject: IUploadCsv = antdForm.getFieldsValue()
        antdForm.validateFields().then(async () => {
            const formData = new FormData();
            fileList.forEach((file) => {
                formData.append('file', file as FileType);
            });
            setUploading(true);
            switch (uploadType) {
                case UploadEnum.ali:
                    fetch(import.meta.env.VITE_UPLOAD_ALI_URL
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
                        }).finally(() => {
                        setUploading(false)
                    })
                    break
                case UploadEnum.weiChect:
                    fetch(import.meta.env.VITE_UPLOAD_WECHAT_URL
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
                        }).finally(() => {
                        setUploading(false)
                    })
            }

        })
    };

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
        <div className={topicSlice.topic ? uploadAli.uploadBox : uploadAli.uploadBoxDark}>
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
                    <Form.Item label={t("Author")}
                               rules={[{required: true, message: t("The submitter cannot be empty")}]}
                               name="username">
                        <Input/>
                    </Form.Item>
                    <Form.Item label={t("Notes on bills")} name="notesOnBills">
                        <TextArea rows={4}/>
                    </Form.Item>
                    <Form.Item label={t("Uploading files")}>
                        <Upload {...props}>
                            <Button icon={<UploadOutlined/>}
                                    disabled={!selectStatus}>{t("Select file")}</Button>
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
                    {uploading ? t("Uploading") : t("Upload")}
                </Button>
            </div>
        </div>
    )
}

export default UploadCheck