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
import { ArrowLeftRight } from "lucide-react";
import { Input } from "@/components/ui/input";

// Currency data with symbols and codes
const format = (value: number, separator: string = ","): string => {
  // Format to 5 decimal places
  const fixedValue = value.toFixed(value < 1 ? 5 : 0);

  // Split into integer and decimal parts
  const [integerPart, decimalPart] = fixedValue.split(".");

  // For numbers less than 1, don't add separators
  if (Math.abs(value) < 1) {
    return fixedValue;
  }

  // Add thousand separators to the integer part
  const formattedIntegerPart = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    separator
  );

  // Return the formatted number with decimal part if it exists
  return decimalPart
    ? `${formattedIntegerPart}.${decimalPart}`
    : formattedIntegerPart;
};
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
  const [targetCurrency, setTargetCurrency] = useState(
    currencies.find((c) => c.isMain)?.id
  );
  const [convertCurrency, setConvertCurrency] = useState(
    currencies.find((c) => c.code === "$")?.id
  );
  const targetCurrencyData = currencies.find((c) => c.id === targetCurrency);
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
            {/* <Input
              onChange={(e) => setAmount(Number(e.target.value))}
              value={amount}
              type="number"
              className="w-42"
            /> */}
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold">
                {(generateCurrenciesRateMap(currencies, currenciesExchange)[
                  targetCurrency as string
                ].find((ex) => ex.targetCurrency.id === convertCurrency)
                  ?.price ?? 0) * amount}
              </span>
              <span>=</span>
            </div>
            <Select value={convertCurrency} onValueChange={setConvertCurrency}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="عملة التحويل" />
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
            <Input
              type="number"
              className="w-[100px]"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
            <div className="text-xl  ">
              <ArrowLeftRight />
            </div>
            <div>
              <div>
                <Select
                  value={targetCurrency}
                  onValueChange={setTargetCurrency}
                >
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
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 relative">
          {generateCurrenciesRateMap(currencies, currenciesExchange)
            [targetCurrency as string].filter(
              (ex) =>
                ex.targetCurrency.id === targetCurrency ||
                ex.sourceCurrency.id === targetCurrency
            )
            .map((ex) => {
              const isTarget = ex.targetCurrency.id === targetCurrency;
              // const isSource = ex.sourceCurrency.id === baseCurrency;

              const tc = isTarget
                ? currencies.find((c) => c.id === ex.sourceCurrency.id)
                : currencies.find((c) => c.id === ex.targetCurrency.id);

              const rate = ex.price;

              return (
                <Card
                  key={tc?.code}
                  className="overflow-hidden border-2 hover:border-primary/50 transition-all  py-1 border-green-700"
                >
                  <CardContent className="p-2">
                    <div className="flex flex-col items-center justify-between ">
                      <div className="flex items-center space-x-2 flex-col">
                        <Image
                          className="me-2"
                          width={80}
                          height={60}
                          src={`/flags/${tc?.flag}.svg`}
                          alt={tc?.name || ""}
                        ></Image>
                        <div>
                          <h3 className="font-bold text-xl">{tc?.name}</h3>
                        </div>
                      </div>
                      <div className=" flex items-center justify-between p-2 w-full">
                        <div className="ms-2 ">
                          <span className="text-xl ">شراء</span>
                        </div>
                        <div className="py-1 px-2 bg-slate-400 rounded text-white text-xl font-bold tracking-[2]">
                          <span className="me-2 text-base" dir="rtl">
                            {targetCurrencyData?.symbol}
                          </span>
                          <span className="text-3xl font-semibold">
                            {format(Number(rate))}
                          </span>
                        </div>
                      </div>
                      <div className=" flex items-center justify-between p-2 w-full">
                        <div className="ms-2 ">
                          <span className="text-xl ">بيع</span>
                        </div>
                        <div className="py-1 px-2 bg-blue-500 rounded text-white text-xl font-bold tracking-[2]">
                          <span className="me-2 text-base" dir="rtl">
                            {targetCurrencyData?.symbol}
                          </span>
                          <span className="text-3xl font-semibold">
                            {format(Number(rate + ex.gap))}
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
