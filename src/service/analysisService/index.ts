import httpAxios from "../../http/HttpAxios";

export function getDateDayDataService<T>(startTime: Date | string, endTime: Date | string): Promise<T> {
    // 如果是Date对象，转换为ISO格式字符串
    const formatDate = (date: Date | string): string => {
        if (date instanceof Date) {
            return date.toISOString().split('T')[0];
        }
        return date;
    };
    
    // 转换为后端需要的格式
    const formattedStartTime = formatDate(startTime);
    const formattedEndTime = formatDate(endTime);
    
    return httpAxios.get<T, T>(`/computed/getDateDayData/${formattedStartTime}/${formattedEndTime}`);
}

export const getDateYearDataService = async <T>(year: number): Promise<T> => {
    try {
        return await httpAxios.get<T, T>(`/computed/getDateYearData/${year}`);
    } catch (error) {
        console.error('获取年度数据失败:', error);
        throw error;
    }
}; 