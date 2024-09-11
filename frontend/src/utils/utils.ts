export const getTodayFormattedDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(today.getDate()).padStart(2, '0');
  // TODO: Switch back to bottom after pulling latest assetPrice
  // return `${year}-${month}-${day}`;
  return `${year}-${month}-06`;
};