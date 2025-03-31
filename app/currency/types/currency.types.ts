export type Currency = {
    id: string;
    name: string;
    symbol: string;
    code: string;
    country_id: string
    country: Country
};

export type Country = {
    id: string;
    name: string;
    code: string;
    flag: string;
    currency_id: string;
    currency: Currency;
};
