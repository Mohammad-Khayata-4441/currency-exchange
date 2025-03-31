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

// Currency data with symbols and codes
const currencies = [
  { code: "USD", name: "دولار أمريكي", symbol: "$", icon: DollarSign },
  { code: "EUR", name: "يورو", symbol: "€", icon: Euro },
  { code: "TRY", name: "ليرة تركية", symbol: "₺" },
  { code: "SYP", name: "ليرة سورية", symbol: "S.P" },
];

// Mock exchange rates (in a real app, you would fetch these from an API)
type ExchangeRates = Record<string, Record<string, number>>;

const exchangeRates: ExchangeRates = {
  USD: { EUR: 0.92, TRY: 30.89, SYP: 12950.0 },
  EUR: { USD: 1.09, TRY: 33.58, SYP: 14076.0 },
  TRY: { USD: 0.032, EUR: 0.03, SYP: 419.23 },
  SYP: { USD: 0.000077, EUR: 0.000071, TRY: 0.0024 },
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
              ويسترن يونيون
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

            return (
              <Card
                key={currency.code}
                className="overflow-hidden border-2 hover:border-primary/50 transition-all  border-green-700"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-full bg-muted aspect-square w-[50px] flex items-center justify-center">
                        <span className="text-2xl font-bold text-yellow-500">
                          {currency.symbol}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold ">{currency.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {currency.code}
                        </p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold">
                      <span className="ms-2">{currency.symbol}</span>
                      <span>
                        {rate > 1 ? Number(rate).toFixed(2) : Number(rate)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <p className="text-muted-foreground">
                      1 {baseCurrency} = {currency.symbol}
                      {Number(rate).toFixed(4)} {currency.code}
                    </p>
                    <p className="text-muted-foreground">
                      1 {currency.code} ={" "}
                      {currencies.find((c) => c.code === baseCurrency)?.symbol}
                      {(1 / rate).toFixed(4)} {baseCurrency}
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
