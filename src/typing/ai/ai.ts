export interface chatHistory {
    id: any,
    title: string,
}

export interface Message {
    type: 'user' | 'ai';
    content: string;
    timestamp: string;
}