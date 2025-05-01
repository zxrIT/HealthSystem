import {FC, ReactElement, useState, useEffect, useCallback} from "react"
import {Button, Input, ConfigProvider} from "antd"
import {SendOutlined, PaperClipOutlined, MessageOutlined} from "@ant-design/icons"
import classStyle from "./AiChat.module.less"
import {useTranslation} from "react-i18next"
import {useSelector} from "react-redux"
import {RootState} from "../../store"
import {theme} from "antd"
import {getChatIdsService} from "../../service/aiService";
import {BaseResponse} from "../../typing/response/baseResponse.ts";
import {chatHistory} from "../../typing/ai/ai.ts";
import AiChatContent from "../../component/ai/AiChatContent.tsx";

const AiChat: FC = (): ReactElement => {
    const {t} = useTranslation();
    const [prompt, setPrompt] = useState<string>();
    const [inputValue, setInputValue] = useState<string>('');
    const [choiceChatId, setChoiceChatId] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [chatHistory, setChatHistory] = useState<chatHistory[]>([])
    const topicSlice = useSelector((state: RootState) => state.topic);

    const handleSendMessage = useCallback((value: string) => {
        if (value.trim()) {
            setPrompt(value);
            setInputValue('');
        }
    }, []);

    useEffect(() => {
        getChatIdsService<BaseResponse<String[]>>().then((response) => {
            if (response.code === 200) {
                const tempChatIds = [] as chatHistory[]
                response.data.forEach((chatId) => {
                    tempChatIds.push({id: chatId, title: "会话 " + chatId})
                })
                setChoiceChatId(tempChatIds.length <= 0 ? "" : tempChatIds[0].id)
                setChatHistory(tempChatIds)
                setLoading(false);
            }
        })
    }, []);

    return (
        <ConfigProvider theme={{
            algorithm: topicSlice.topic ? theme.defaultAlgorithm : theme.darkAlgorithm
        }}>
            <div className={classStyle.aiChatBox} style={{color: topicSlice.topic ? "black" : "white"}}>
                <div className={classStyle.chatSidebar}>
                    <div className={classStyle.sidebarHeader}>
                        <h2>{t("Chat history")}</h2>
                        <Button
                            type="primary"
                            icon={<span>+</span>}
                        >
                            {t("New dialogue")}
                        </Button>
                    </div>
                    <div className={classStyle.chatList} style={{color: topicSlice.topic ? "black" : "white"}}>
                        {chatHistory.map((chat) => (
                            <div key={chat.id} className={classStyle.chatItem} onClick={() => {
                                setChoiceChatId(chat.id)
                            }}>
                                <MessageOutlined className={classStyle.chatIcon}/>
                                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{t("dialogue")}：{chat.id}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={classStyle.chatMain}>
                    <div className={classStyle.chatContent}>
                        {!loading &&  <AiChatContent chatId={choiceChatId} message={prompt}/>}
                    </div>
                    <div className={classStyle.chatInputArea}>
                        <Input 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onPressEnter={(event) => {
                                handleSendMessage((event.target as any).value);
                            }}
                            placeholder={t("Input messages, upload pictures, videos...")}
                            suffix={
                                <div className={classStyle.inputActions}>
                                    <PaperClipOutlined className={classStyle.uploadIcon}/>
                                    <Button
                                        type="primary"
                                        icon={<SendOutlined/>}
                                        className={classStyle.sendButton}
                                        onClick={() => {
                                            handleSendMessage(inputValue);
                                        }}
                                    />
                                </div>
                            }
                        />
                    </div>
                </div>
            </div>
        </ConfigProvider>
    )
}

export default AiChat 