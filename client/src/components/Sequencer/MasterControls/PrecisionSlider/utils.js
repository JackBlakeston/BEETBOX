import Fraction from 'fraction.js';

export function getConvertedValue (precision) {
  return Math.log2(1 / precision);
}

export function convertToFraction (precision) {
  return new Fraction(precision).toFraction();
}