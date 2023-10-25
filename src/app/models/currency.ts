export interface Option {
  value: string;
  label: string;
}

// export interface Currency extends Option {
//   symbol: string;
// }

export interface Currency extends Option {
  symbol: string;
}

export interface CurrencyInputValue {
  amount: number;
  currency: Currency;
}

export interface ICurrencyRates {
  [currencyCode: string]: string;
}
