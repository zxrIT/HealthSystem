import uploadAli from "./UploadCheck.module.less"
import {FC, ReactElement, useEffect, useState} from "react"
import {Button, Form, Input, message, Upload} from 'antd';
import type {GetProp, UploadFile, UploadProps} from 'antd';

const {TextArea} = Input;
import {Upload as UploadEnum} from "../../typing/enum";
import {useForm} from "antd/es/form/Form";
import {UploadOutlined} from "@ant-design/icons";
import {IUploadCsv} from "../../typing/upload/upload.ts";
import httpAxios from "../../http/HttpAxios.ts";

interface IProps {
    uploadTitle: string,
    uploadType: UploadEnum,
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const UploadCheck: FC<IProps> = ({uploadTitle, uploadType}): ReactElement => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [selectStatus, setSelectStatus] = useState<boolean>(true)
    const [uploading, setUploading] = useState(false);
    const [antdForm] = useForm()

    const handleUpload = () => {
        const uploadObject: IUploadCsv = antdForm.getFieldsValue()
        antdForm.validateFields().then(() => {
            const formData = new FormData();
            fileList.forEach((file) => {
                formData.append('file', file as FileType);
            });
            setUploading(true);
            fetch('http://localhost:10000/upload/csv/'
                + uploadObject.username + "/" + "111" + "/" +
                (uploadObject.notesOnBills === undefined ? "upload" : uploadObject.notesOnBills), {
                method: 'POST',
                body: formData,
            }).then((res) => res.json())
                .then((response) => {
                    if (response.code === 200) {
                        setFileList([]);
                        message.success(response.data);
                    } else {
                        message.error(response.data);
                    }
                }).finally(() => {
                setUploading(false);
            });
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