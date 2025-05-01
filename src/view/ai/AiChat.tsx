import {FC, ReactElement, useState, useEffect, useCallback} from "react"
import {Button, Input, ConfigProvider, message} from "antd"
import {SendOutlined, PaperClipOutlined, MessageOutlined} from "@ant-design/icons"
import classStyle from "./AiChat.module.less"
import {useTranslation} from "react-i18next"
import {useSelector} from "react-redux"
import {RootState} from "../../store"
import {theme} from "antd"
import {getChatIdsService, createChatIdService} from "../../service/aiService";
import {BaseResponse} from "../../typing/response/baseResponse.ts";
import {chatHistory} from "../../typing/ai/ai.ts";
import AiChatContent from "../../component/ai/AiChatContent.tsx";

const AiChat: FC = (): ReactElement => {
    const {t} = useTranslation();
    const [prompt, setPrompt] = useState<string>();
    const [choiceChatId, setChoiceChatId] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [chatHistory, setChatHistory] = useState<chatHistory[]>([])
    const topicSlice = useSelector((state: RootState) => state.topic);
    const [inputValue, setInputValue] = useState<string>('');

    // 生成10位随机数
    const generateChatId = useCallback(() => {
        const min = 1000000000; // 10位数的最小值
        const max = 9999999999; // 10位数的最大值
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }, []);

    // 创建新对话
    const handleCreateNewChat = useCallback(() => {
        const newChatId = generateChatId().toString();
        createChatIdService<BaseResponse<string>>(newChatId).then((response) => {
            if (response.code === 200) {
                const newChat: chatHistory = {
                    id: newChatId,
                    title: "会话 " + newChatId
                };
                setChatHistory(prev => [...prev, newChat]);
                setChoiceChatId(newChatId);
            } else {
                message.error(t("Failed to create new chat"));
            }
        }).catch(() => {
            message.error(t("Failed to create new chat"));
        });
    }, [generateChatId, t]);

    const handleSendMessage = useCallback((value: string) => {
        if (value.trim()) {
            setPrompt(value);
            setInputValue(''); // 清空输入框
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
                            onClick={handleCreateNewChat}
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