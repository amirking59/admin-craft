import dayjs, { Dayjs } from 'dayjs';

export const formatDate = (date?: string | Date | Dayjs | null, showTime = true): string => {
  if (!date) return '';

  return dayjs(date).format(`YYYY/MM/DD${showTime ? ' - HH:mm' : ''}`);
};
