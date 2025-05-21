export function formatCurrency(number) {
  if (isNaN(number)) {
    return "Invalid Number";
  }

  const hundred = 100;
  const thousand = 1000;
  const lakh = 100000;
  const crore = 10000000;

  if (number >= crore) {
    return `${Math.floor(number / crore)} Crore ${formatCurrency(number % crore)}`.replace(/^\s+|\s+$/g, '');
  } else if (number >= lakh) {
    return `${Math.floor(number / lakh)} Lakh ${formatCurrency(number % lakh)}`.replace(/^\s+|\s+$/g, '');
  } else if (number >= thousand) {
    return `${Math.floor(number / thousand)} Thousand ${formatCurrency(number % thousand)}`.replace(/^\s+|\s+$/g, '');
  } else if (number >= hundred) {
    return `${Math.floor(number / hundred)} Hundred`.replace(/^\s+|\s+$/g, '');
  } else {
    return number === 0 ? '' : `${number}`; // Return empty string for 0 to avoid trailing '0'
  }
}