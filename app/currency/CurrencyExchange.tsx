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
import Image from "next/image";
import { Currency, CurrencyExchange } from "./types/currency.types";
import Marquee from "react-fast-marquee";
import { Input } from "@/components/ui/input";

// Currency data with symbols and codes

const generateCurrenciesRateMap = (
  currencies: Currency[],
  currenciesExchange: CurrencyExchange[]
): Record<string, Array<CurrencyExchange>> => {
  const currenciesRateMap: Record<string, Array<CurrencyExchange>> = {};

  // Initialize the map with empty arrays for each currency
  currencies.forEach((currency) => {
    currenciesRateMap[currency.id] = [];
  });

  // Process direct exchanges
  currenciesExchange.forEach((exchange) => {
    const sourceCurrencyId = exchange.sourceCurrency.id;

    // Add the exchange to the source currency's array
    if (!currenciesRateMap[sourceCurrencyId]) {
      currenciesRateMap[sourceCurrencyId] = [];
    }

    currenciesRateMap[sourceCurrencyId].push(exchange);
  });

  // Fill in missing exchanges by calculating reverse rates
  currencies.forEach((sourceCurrency) => {
    currencies.forEach((targetCurrency) => {
      // Skip if it's the same currency
      if (sourceCurrency.id === targetCurrency.id) {
        return;
      }

      // Check if exchange already exists
      const exchangeExists = currenciesRateMap[sourceCurrency.id].some(
        (exchange) => exchange.targetCurrency.id === targetCurrency.id
      );

      if (!exchangeExists) {
        // Look for reverse exchange
        const reverseExchange = currenciesRateMap[targetCurrency.id]?.find(
          (exchange) => exchange.targetCurrency.id === sourceCurrency.id
        );

        if (reverseExchange) {
          const originalBuyPrice = reverseExchange.price;
          const originalSellPrice = originalBuyPrice + reverseExchange.gap;

          const reverseBuyPrice = 1 / originalSellPrice;
          const reverseSellPrice = 1 / originalBuyPrice;

          // New gap is the difference between reverse sell and reverse buy
          const reverseGap = reverseSellPrice - reverseBuyPrice;

          // Calculate reverse rate
          const calculatedExchange: CurrencyExchange = {
            id: `calculated-${sourceCurrency.id}-${targetCurrency.id}`,
            sourceCurrency: sourceCurrency,
            targetCurrency: targetCurrency,
            price: 1 / reverseExchange.price,
            gap: reverseGap, // May need different logic for gap
            reverse: true,
            createdAt: reverseExchange.createdAt,
            updatedAt: reverseExchange.updatedAt,
          };

          currenciesRateMap[sourceCurrency.id].push(calculatedExchange);
        }
      }
    });
  });

  return currenciesRateMap;
};
export default function CurrencyExchangeHero({
  currencies,
  currentDate,
  currenciesExchange,
}: {
  currencies: Currency[];
  currenciesExchange: CurrencyExchange[];
  currentDate: string;
}) {
  // const [reverse, setReverse] = useState(false);
  const [amount, setAmount] = useState(1);
  const [baseCurrency, setBaseCurrency] = useState(
    currencies.find((c) => c.isMain)?.id
  );

  // Get currencies to display (all except the base currency)

  const marqueeLogos = [
    { src: "/logos/wu.jpg", title: "Western Union" },
    { src: "/logos/usdt.png", title: "USDT" },
    { src: "/logos/bnb.png", title: "BNB" },
    { src: "/logos/sham.png", title: "Sham" },
    // { src: "/logos/eth.png", title: "Ethereum" },
    { src: "/logos/whish.jpg", title: "Whish" },
    { src: "/logos/moneygram.png", title: "MoneyGram" },
  ];

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
          <div className="flex items-center gap-2">
            <Input
              onChange={(e) => setAmount(Number(e.target.value))}
              value={amount}
              type="number"
              className="w-42"
            />
            <Select value={baseCurrency} onValueChange={setBaseCurrency}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="العملة الاساسية" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.id} value={currency.id}>
                    <Image
                      className="me-2 rounded"
                      height={15}
                      width={30}
                      src={`/flags/${currency.flag}.svg`}
                      alt=""
                    />{" "}
                    {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 relative">
          {generateCurrenciesRateMap(currencies, currenciesExchange)
            [baseCurrency as string].filter(
              (ex) =>
                ex.targetCurrency.id === baseCurrency ||
                ex.sourceCurrency.id === baseCurrency
            )
            .map((ex) => {
              const isTarget = ex.targetCurrency.id === baseCurrency;
              // const isSource = ex.sourceCurrency.id === baseCurrency;

              const targetCurrency = isTarget
                ? currencies.find((c) => c.id === ex.sourceCurrency.id)
                : currencies.find((c) => c.id === ex.targetCurrency.id);

              const rate = ex.price * amount;

              const isSmall = rate < 1;

              return (
                <Card
                  key={targetCurrency?.code}
                  className="overflow-hidden border-2 hover:border-primary/50 transition-all  border-green-700"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Image
                          className="me-2"
                          width={80}
                          height={60}
                          src={`/flags/${targetCurrency?.flag}.svg`}
                          alt={targetCurrency?.name || ""}
                        ></Image>
                        <div>
                          <h3 className="font-bold text-xl">
                            {targetCurrency?.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {targetCurrency?.code}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="text-2xl">
                          <span className="ms-2" dir="rtl">
                            {targetCurrency?.symbol}
                          </span>
                          <span>{Number(rate).toFixed(isSmall ? 5 : 2)}</span>
                          <span className="ms-2 text-green-500 text-sm">
                            شراء
                          </span>
                        </div>
                        <div className="text-2xl">
                          <span className="ms-2" dir="rtl">
                            {targetCurrency?.symbol}
                          </span>
                          <span>
                            {Number(rate + ex.gap * amount).toFixed(
                              isSmall ? 5 : 2
                            )}
                          </span>
                          <span className="ms-2 text-red-500 text-sm">
                            مبيع
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </div>
      <div dir="ltr" className="my-12">
        <Marquee speed={200} autoFill>
          {marqueeLogos.map((logo, index) => (
            <Card
              key={index}
              className="p-1 mx-8 h-[100px] w-[100px] flex items-center justify-center"
            >
              <Image
                src={logo.src}
                alt={logo.title}
                height={80}
                width={120}
                className="object-contain h-full w-auto"
              />
            </Card>
          ))}
        </Marquee>
      </div>
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>اخر تحديث للأسعار بتاريخ : {currentDate}</p>
        <p className="mt-1 text-lg">حلب - الجميلية - شارع جامع الصديق</p>
      </div>
    </section>
  );
}
