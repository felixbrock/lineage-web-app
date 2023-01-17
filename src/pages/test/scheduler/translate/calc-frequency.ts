export default (date1: number, date2: number): number => {
  const diffTime = Math.abs(date2 - date1);
  const diffMins = Math.ceil(diffTime / (1000 * 60));
  return diffMins;
};
