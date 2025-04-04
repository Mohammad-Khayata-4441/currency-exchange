export type Currency = {
    id: string;
    name: string;
    symbol: string;
    code: string;
    flag: string;
    isMain: boolean;
    country_id: string
    country: Country
};


export type CurrencyExchange = {
    id: string;
    sourceCurrency: Currency;
    targetCurrency: Currency;
    price: number;
    gap: number
    reverse: boolean
    createdAt: string;
    updatedAt: string;
}


export type Country = {
    id: string;
    name: string;
    code: string;
    flag: string;
    currency_id: string;
    currency: Currency;
};
