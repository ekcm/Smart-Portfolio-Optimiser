import { format } from "date-fns";

export const getTodayFormattedDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(today.getDate()).padStart(2, '0');
  // TODO: Switch back to bottom after pulling latest assetPrice
  // return `${year}-${month}-${day}`;
  return `${year}-10-31`;
};

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));


export const getFormattedReportDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}_${month}_${day}`;
};

export const getMonthYearString = (date: Date | undefined): string | undefined => {
  return date ? format(date, 'dd MMMM yyyy').replace(/\s+/g, '') : undefined;
};