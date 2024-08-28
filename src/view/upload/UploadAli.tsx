import React, {useState} from "react"
import uploadAli from "./UploadAli.module.less"
import type {FC, ReactElement} from "react"
import {InboxOutlined} from '@ant-design/icons';
import {DatePicker, Form, Input,} from 'antd';
import type {UploadProps} from 'antd';

const {RangePicker} = DatePicker;
const {TextArea} = Input;
import {message, Upload} from 'antd';

const {Dragger} = Upload;

const props: UploadProps = {
    name: 'file',
    multiple: true,
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    onChange(info) {
        const {status} = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
    onDrop(e) {
        console.log('Dropped files', e.dataTransfer.files);
    },
} as UploadProps;



const UploadAli: FC = (): ReactElement => {

    return (
        <div className={uploadAli.uploadBox}>
            <div className={uploadAli.navigate}>支付宝账单提交</div>
            <div className={uploadAli.uploadForm}>
                <Form
                    labelCol={{span: 4}}
                    wrapperCol={{span: 6}}
                    layout="horizontal"
                    labelWrap
                    style={{maxWidth: "100%"}}
                >
                    <Form.Item label="提交人">
                        <Input/>
                    </Form.Item>
                    <Form.Item label="账单时间段">
                        <RangePicker/>
                    </Form.Item>
                    <Form.Item label="账单备注">
                        <TextArea rows={4}/>
                    </Form.Item>
                    <Form.Item label="上传文件">
                        <Dragger {...props}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined/>
                            </p>
                            <p className="ant-upload-text">点击选择文件或者将账单文件拖拽进来</p>
                            <p className="ant-upload-hint">
                                注意上传的文件需要以.csv后缀结尾
                            </p>
                        </Dragger>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default UploadAli