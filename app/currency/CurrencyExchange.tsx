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

// Currency data with symbols and codes

export default function CurrencyExchangeHero({
  currencies,
  currentDate,
  currenciesExchange,
}: {
  currencies: Currency[];
  currenciesExchange: CurrencyExchange[];
  currentDate: string;
}) {
  const [baseCurrency, setBaseCurrency] = useState(
    currencies.find((c) => c.isMain)?.id
  );

  const currentCurrencyExchanges = currenciesExchange.filter(
    (c) => c.sourceCurrency.id === baseCurrency
  );

  // Get currencies to display (all except the base currency)
  const currenciesToShow = currencies
    .filter((c) =>
      currentCurrencyExchanges.some((ex) => ex.targetCurrency.id === c.id)
    )
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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 relative">
          {currenciesToShow.map((currency) => {
            const currencyExchange = currentCurrencyExchanges.find(
              (c) =>
                c.sourceCurrency.id === baseCurrency &&
                c.targetCurrency.id === currency.id
            );
            if (!currencyExchange) return null;

            const rate = currencyExchange.price;

            const baseSymbol = currencies.find(
              (c) => c.code === baseCurrency
            )?.symbol;
            const shouldInvert = false;

            const displayRate = shouldInvert ? 1 / rate : rate;
            const displaySellRate = shouldInvert ? 1 / rate : rate;

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
                        src={`/flags/${currency.flag}.svg`}
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
                        <span className="ms-2" dir="rtl">
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
                        <span className="ms-2" dir="rtl">
                          {shouldInvert ? baseSymbol : currency.symbol}
                        </span>
                        <span>
                          {displaySellRate > 1
                            ? Number(
                                displaySellRate + currencyExchange.gap
                              ).toFixed(2)
                            : Number(
                                displaySellRate + currencyExchange.gap
                              ).toFixed(4)}
                        </span>
                        <span className="ms-2 text-red-500 text-sm">مبيع</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      <div dir="rtl" className="my-12">
        <Marquee speed={200}>
          <div className="flex gap-16 ">
            <Card className="p-1 mx-2 h-[100px] w-[100px] flex items-center justify-center">
              <Image
                src="/logos/wu.jpg"
                alt="us"
                height={80}
                width={120}
                className="object-contain h-full w-auto"
              />
            </Card>
            <Card className="p-1 mx-2 h-[100px] w-[100px] flex items-center justify-center">
              <Image
                src="/logos/usdt.png"
                alt="us"
                height={80}
                width={120}
                className="object-contain h-full w-auto"
              />
            </Card>

            <Card className="p-1 mx-2 h-[100px] w-[100px] flex items-center justify-center">
              <Image
                src="/logos/bnb.png"
                alt="us"
                height={80}
                width={120}
                className="object-contain h-full w-auto"
              />
            </Card>
            <Card className="p-1 mx-2 h-[100px] w-[100px] flex items-center justify-center">
              <Image
                src="/logos/ria.png"
                alt="us"
                height={80}
                width={120}
                className="object-contain h-full w-auto"
              />
            </Card>
            <Card className="p-1 mx-2 h-[100px] w-[100px] flex items-center justify-center">
              <Image
                src="/logos/eth.png"
                alt="us"
                height={80}
                width={120}
                className="object-contain h-full w-auto"
              />
            </Card>
            <Card className="p-1 mx-2 h-[100px] w-[100px] flex items-center justify-center">
              <Image
                src="/logos/whish.jpg"
                alt="us"
                height={80}
                width={120}
                className="object-contain h-full w-auto"
              />
            </Card>
            <Card className="p-1 mx-2 h-[100px] w-[100px] flex items-center justify-center">
              <Image
                src="/logos/moneygram.png"
                alt="us"
                height={80}
                width={120}
                className="object-contain h-full w-auto"
              />
            </Card>
          </div>
        </Marquee>
      </div>
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>اخر تحديث للأسعار بتاريخ : {currentDate}</p>
        <p className="mt-1 text-lg">حلب - الجميلية - شارع جامع الصديق</p>
      </div>
    </section>
  );
}
