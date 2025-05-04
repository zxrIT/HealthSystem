import request from '../utils/request';
 
export const getDateDayDataService = <T>(startTime: Date, endTime: Date): Promise<T> => {
    return request.get(`/api/analysis/getDateDayData/${startTime}/${endTime}`);
}; 