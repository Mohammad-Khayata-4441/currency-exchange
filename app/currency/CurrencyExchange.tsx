"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Euro } from "lucide-react";
import Image from "next/image";

// Currency data with symbols and codes
const currencies = [
  {
    flag: "/flags/us.svg",
    code: "USD",
    name: "دولار أمريكي",
    symbol: "$",
    icon: DollarSign,
  },
  { flag: "/flags/eu.svg", code: "EUR", name: "يورو", symbol: "€", icon: Euro },
  { flag: "/flags/tr.svg", code: "TRY", name: "ليرة تركية", symbol: "₺" },
  { flag: "/flags/sy.svg", code: "SYP", name: "ليرة سورية", symbol: "S.P" },
];

// Mock exchange rates (in a real app, you would fetch these from an API)
type ExchangeRates = Record<
  string,
  Record<string, { sell: number; buy: number }>
>;
const exchangeRates: ExchangeRates = {
  USD: {
    EUR: { sell: 0.92, buy: 0.9 },
    TRY: { sell: 30.89, buy: 30.5 },
    SYP: { sell: 12950.0, buy: 12900.0 },
  },
  EUR: {
    USD: { sell: 1.09, buy: 1.07 },
    TRY: { sell: 33.58, buy: 33.2 },
    SYP: { sell: 14076.0, buy: 14000.0 },
  },
  TRY: {
    USD: { sell: 0.032, buy: 0.03 },
    EUR: { sell: 0.03, buy: 0.028 },
    SYP: { sell: 419.23, buy: 415.0 },
  },
  SYP: {
    USD: { sell: 0.000077, buy: 0.000075 },
    EUR: { sell: 0.000071, buy: 0.000069 },
    TRY: { sell: 0.0024, buy: 0.0022 },
  },
};

export default function CurrencyExchangeHero() {
  const [baseCurrency, setBaseCurrency] = useState("USD");

  // Get currencies to display (all except the base currency)
  const currenciesToShow = currencies
    .filter((c) => c.code !== baseCurrency)
    .slice(0, 3);

  return (
    <section className="w-full bg-gradient-to-b from-muted/50 to-background pb-4">
      <div className="w-full h-[400px] overflow-hidden relative">
        <video
          width={"100%"}
          height={100}
          autoPlay
          muted
          loop
          className="w-full  overflow-hidden  object-cover"
        >
          <source src="/exchange.mp4"></source>
        </video>

        <div className="flex items-center bg-gray-800/70 absolute left-0 top-0 h-[400px] w-full justify-center  z-10">
          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <h1 className="text-3xl text- text-yellow-400 font-bold tracking-tighter sm:text-4xl md:text-7xl mb-8">
              الصافي للصرافة والحوالات المالية
            </h1>
            <p className="max-w-[700px] text-background md:text-xl">
              استلام وارسال الحوالات المالية من كافة دول العالم
            </p>
            <p className="max-w-[700px] text-background md:text-xl">
              تصريف دولار ، يورو ، تركي
            </p>
            <p className="max-w-[700px] text-background md:text-xl">
              سحب وايداع من جميع المحفظات الالكترونية وبجميع العملات الرقمية
            </p>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-4">
        <div className="flex items-center justify-between mb-4">
          <p className="font-medium">العملة الاساسية</p>
          <Select value={baseCurrency} onValueChange={setBaseCurrency}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="العملة الاساسية" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 relative">
          {currenciesToShow.map((currency) => {
            const rate = exchangeRates[baseCurrency][currency.code];
            const baseSymbol = currencies.find(
              (c) => c.code === baseCurrency
            )?.symbol;
            const shouldInvert = rate.buy < 1;

            const displayRate = shouldInvert ? 1 / rate.sell : rate.buy;
            const displaySellRate = shouldInvert ? 1 / rate.buy : rate.sell;

            return (
              <Card
                key={currency.code}
                className="overflow-hidden border-2 hover:border-primary/50 transition-all  border-green-700"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Image
                        className="me-2"
                        width={80}
                        height={60}
                        src={currency.flag}
                        alt={currency.name}
                      ></Image>
                      <div>
                        <h3 className="font-bold text-xl">{currency.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {currency.code}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="text-2xl">
                        <span className="ms-2">
                          {shouldInvert ? baseSymbol : currency.symbol}
                        </span>
                        <span>
                          {displayRate > 1
                            ? Number(displayRate).toFixed(2)
                            : Number(displayRate).toFixed(4)}
                        </span>
                        <span className="ms-2 text-green-500 text-sm">
                          شراء
                        </span>
                      </div>
                      <div className="text-2xl">
                        <span className="ms-2">
                          {shouldInvert ? baseSymbol : currency.symbol}
                        </span>
                        <span>
                          {displaySellRate > 1
                            ? Number(displaySellRate).toFixed(2)
                            : Number(displaySellRate).toFixed(4)}
                        </span>
                        <span className="ms-2 text-red-500 text-sm">مبيع</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <p className="text-muted-foreground">
                      {shouldInvert ? (
                        <>
                          <span>{baseCurrency}</span>
                          <span> = </span>
                          <span>{currency.symbol}</span>
                          <span>{rate.buy.toFixed(4)}</span>
                          <span> {currency.code}</span>
                        </>
                      ) : (
                        <>
                          <span>{currency.code}</span>
                          <span> = </span>
                          <span>{baseSymbol}</span>
                          <span>{(1 / rate.buy).toFixed(4)}</span>
                          <span> {baseCurrency}</span>
                        </>
                      )}
                    </p>
                    <p className="text-muted-foreground">
                      {shouldInvert ? (
                        <>
                          <span>{baseCurrency}</span>
                          <span> = </span>
                          <span>{currency.symbol}</span>
                          <span>{rate.buy.toFixed(4)}</span>
                          <span> {currency.code}</span>
                        </>
                      ) : (
                        <>
                          <span>{currency.code}</span>
                          <span> = </span>
                          <span>{baseSymbol}</span>
                          <span>{(1 / rate.buy).toFixed(4)}</span>
                          <span> {baseCurrency}</span>
                        </>
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            اخر تحديث للأسعار بتاريخ : {new Date().toLocaleDateString()}{" "}
            {new Date().toLocaleTimeString()}
          </p>
          <p className="mt-1 text-lg">حلب - الجميلية - شارع جامع الصديق</p>
        </div>
      </div>
    </section>
  );
}
