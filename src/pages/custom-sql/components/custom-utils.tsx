export const frequencies = [1, 3, 6, 12, 24, 0];
export type Frequency = typeof frequencies[number];

export const buildCronExpression = (frequency: string) => {
    const currentDate = new Date();
    const currentMinutes = currentDate.getUTCMinutes();
    const currentHours = currentDate.getUTCHours();
  
    switch (frequency) {
      case '1h':
        return `${currentMinutes} * * * ? *`;
  
      case '3h':
        return `${currentMinutes} */3 * * ? *`;
  
      case '6h':
        return `${currentMinutes} */6 * * ? *`;
  
      case '12h':
        return `${currentMinutes} */12 * * ? *`;
  
      case '24h':
        return `${currentMinutes} ${currentHours} * * ? *`;
      default:
        return '';
    }
};

export const getFrequency = (cron: string): Frequency => {
  if (cron === 'custom') return 0;
  const parts = cron.split(' ');

  if (parts.length !== 6)
    throw new Error(
      'Unexpected cron exp. format received. Expected 6 elements'
    );

  if (
    !Number.isNaN(Number(parts[0])) &&
    parts.slice(1).every((el) => el === '*' || el === '?')
  )
    return 1;
  if (
    !Number.isNaN(Number(parts[0])) &&
    parts[1] === '*/3' &&
    parts.slice(2).every((el) => el === '*' || el === '?')
  )
    return 3;
  if (
    !Number.isNaN(Number(parts[0])) &&
    parts[1] === '*/6' &&
    parts.slice(2).every((el) => el === '*' || el === '?')
  )
    return 6;
  if (
    !Number.isNaN(Number(parts[0])) &&
    parts[1] === '*/12' &&
    parts.slice(2).every((el) => el === '*' || el === '?')
  )
    return 12;
  if (
    !Number.isNaN(Number(parts[0])) &&
    !Number.isNaN(Number(parts[1])) &&
    parts.slice(2).every((el) => el === '*' || el === '?')
  )
    return 24;
  return 0;
};

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}