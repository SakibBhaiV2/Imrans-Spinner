/* © 2025 IMRAN — All rights reserved. */

const BENGALI_NUMERALS: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

/**
 * Converts any number or numeric string to Bengali numerals
 * e.g. 15 -> '১৫', '42' -> '৪২'
 */
export function toBengaliNumber(n: number | string): string {
  const str = String(n);
  return str.replace(/[0-9]/g, (digit) => BENGALI_NUMERALS[digit] || digit);
}

/**
 * Formats timestamp to a localized Bengali time representation
 */
export function formatBengaliTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const period = hours >= 12 ? 'অপরাহ্ন' : 'পূর্বাহ্ন';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;

  return `${toBengaliNumber(displayHours)}:${toBengaliNumber(minutes)} ${period}`;
}
