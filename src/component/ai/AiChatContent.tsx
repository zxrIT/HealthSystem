import React, {FC, ReactElement, useEffect, useState, useRef} from "react"
import {Avatar} from "antd"
import classStyle from "./AiChatContent.module.less"
import {RobotOutlined} from "@ant-design/icons"
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {Message} from "../../typing/ai/ai.ts";
import {getChatMessagesService, getChatHistoryService} from "../../service/aiService";
import {BaseResponse} from "../../typing/response/baseResponse.ts";

interface IProps {
    chatId: string,
    message?: string
}

const AiChatContent: FC<IProps> = React.memo(({chatId, message}): ReactElement => {
    const user = useSelector((state: RootState) => state.user);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [displayText, setDisplayText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const lastMessageRef = useRef<string | undefined>(undefined);
    const typingMessageIndexRef = useRef<number>(-1);
    const isFirstLoadRef = useRef<boolean>(true);
    const abortControllerRef = useRef<AbortController | null>(null);
    const pendingRequestRef = useRef<{message: string, chatId: string} | null>(null);

    // 打字机效果
    const typeWriter = (text: string) => {
        setIsTyping(true);
        let index = 0;
        setDisplayText('');

        const timer = setInterval(() => {
            if (index < text.length) {
                setDisplayText((prev) => prev + text.charAt(index));
                index++;
            } else {
                clearInterval(timer);
                setIsTyping(false);
            }
        }, 30);
        return () => clearInterval(timer);
    };

    const scrollToBottom = () => {
        if (contentRef.current) {
            contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
    };

    // 监听消息变化，自动滚动到底部
    useEffect(() => {
        scrollToBottom();
    }, [messages, displayText]);

    const sendMessage = (chatId: string, message: string) => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        
        abortControllerRef.current = new AbortController();
        pendingRequestRef.current = { message, chatId };
        
        setIsLoading(true);
        getChatMessagesService<BaseResponse<string>>(chatId, message, abortControllerRef.current.signal).then((response) => {
            if (response.code === 200) {
                setIsLoading(false);
                const newMessage: Message = {
                    type: "ai",
                    content: response.data,
                    timestamp: new Date().toLocaleString()
                };
                setMessages(prev => {
                    const newMessages = [...prev, newMessage];
                    typingMessageIndexRef.current = newMessages.length - 1;
                    return newMessages;
                });
                typeWriter(response.data);
                pendingRequestRef.current = null;
            }
        }).catch((error) => {
            if (error.name === 'AbortError') {
                console.log('Request was aborted');
            } else {
                setIsLoading(false);
                pendingRequestRef.current = null;
            }
        });
    };

    useEffect(() => {
        if (message !== undefined && message !== lastMessageRef.current) {
            lastMessageRef.current = message;
            
            // 添加用户消息
            const userMessage: Message = {
                type: "user",
                content: message,
                timestamp: new Date().toLocaleString()
            };
            setMessages(prev => [...prev, userMessage]);
            
            sendMessage(chatId, message);
        }
    }, [message, chatId]);

    useEffect(() => {
        setMessages([]);
        setIsLoading(true);
        
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        
        abortControllerRef.current = new AbortController();
        
        // 首先尝试获取历史记录
        getChatHistoryService<BaseResponse<Message[]>>(chatId, abortControllerRef.current.signal).then((response) => {
            if (response.code === 200 && response.data.length > 0) {
                // 如果有历史记录，直接显示
                setMessages(response.data);
                setIsLoading(false);
            } else {
                // 如果没有历史记录，发送欢迎消息
                sendMessage(chatId, "你好,我是" + user.user.username);
            }
        }).catch((error) => {
            if (error.name === 'AbortError') {
                console.log('Request was aborted');
            } else {
                // 如果获取历史记录失败，也发送欢迎消息
                sendMessage(chatId, "你好,我是" + user.user.username);
            }
        });
    }, [chatId]);

    // 组件卸载时取消所有未完成的请求
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    // 检查是否有未完成的请求需要重新发送
    useEffect(() => {
        if (pendingRequestRef.current && pendingRequestRef.current.chatId === chatId) {
            sendMessage(chatId, pendingRequestRef.current.message);
        }
    }, [chatId]);

    return (
        <div className={classStyle.chatContentBox} ref={contentRef}>
            {messages.map((message, index) => (
                <div
                    key={index}
                    className={`${classStyle.messageItem} ${
                        message.type === 'user' ? classStyle.userMessage : classStyle.aiMessage
                    }`}
                >
                    <div className={classStyle.messageHeader}>
                        <Avatar
                            src={message.type === 'user' ? user.user.imageUrl : undefined}
                            icon={message.type === 'user' ? undefined : <RobotOutlined/>}
                            className={message.type === 'user' ? classStyle.userAvatar : classStyle.aiAvatar}
                        />
                        <span className={classStyle.timestamp}>
                            {message.timestamp} {message.type === 'user' ? user.user.username : 'deepseekR1深度思考'}
                        </span>
                    </div>
                    <div className={classStyle.messageContent}>
                        {message.type === 'ai' && isTyping && index === typingMessageIndexRef.current ? (
                            displayText.split('\n').map((line, i) => (
                                <p key={i}>{line}</p>
                            ))
                        ) : (
                            message.content.split('\n').map((line, i) => (
                                <p key={i}>{line}</p>
                            ))
                        )}
                    </div>
                </div>
            ))}
            {isLoading && (
                <div className={`${classStyle.messageItem} ${classStyle.aiMessage}`}>
                    <div className={classStyle.messageHeader}>
                        <Avatar
                            icon={<RobotOutlined/>}
                            className={classStyle.aiAvatar}
                        />
                        <span className={classStyle.timestamp}>
                            {new Date().toLocaleString()} deepseekR1深度思考
                        </span>
                    </div>
                    <div className={`${classStyle.messageContent} ${classStyle.loadingContent}`}>
                        <div className={classStyle.loadingDots}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

export default AiChatContent; 