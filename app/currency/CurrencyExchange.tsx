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
import { ArrowLeftRight, CheckCircle, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";

// Types
interface FormatOptions {
  value: number;
  separator?: string;
}

interface CurrencyConverterProps {
  amount: number | null;
  setAmount: (amount: number) => void;
  convertCurrency: string;
  setConvertCurrency: (currency: string) => void;
  targetCurrency: string;
  setTargetCurrency: (currency: string) => void;
  currencies: Currency[];
  currenciesExchange: CurrencyExchange[];
  disabledCurrency: string;
  label: string;
}

interface CurrencySelectProps {
  value: string;
  onChange: (value: string) => void;
  currencies: Currency[];
  disabledCurrency: string;
  placeholder: string;
}

interface CurrencyCardProps {
  currency: Currency | undefined;
  rate: number;
  gap: number;
  targetCurrencySymbol: string | undefined;
}

interface RateDisplayProps {
  label: string;
  rate: number;
  symbol: string | undefined;
  bgColor: string;
}

interface HeroSectionProps {
  title?: string;
  description?: string;
}

interface MarqueeLogoProps {
  src: string;
  title: string;
}

// Utility functions
const format = ({ value, separator = "," }: FormatOptions): string => {
  const fixedValue = value.toFixed(value < 1 ? 5 : 0);
  const [integerPart, decimalPart] = fixedValue.split(".");

  if (Math.abs(value) < 1) return fixedValue;

  const formattedIntegerPart = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    separator
  );

  return decimalPart
    ? `${formattedIntegerPart}.${decimalPart}`
    : formattedIntegerPart;
};

const generateCurrenciesRateMap = (
  currencies: Currency[],
  currenciesExchange: CurrencyExchange[]
): Record<string, Array<CurrencyExchange>> => {
  const currenciesRateMap: Record<string, Array<CurrencyExchange>> = {};

  currencies.forEach((currency) => {
    currenciesRateMap[currency.id] = [];
  });

  currenciesExchange.forEach((exchange) => {
    const sourceCurrencyId = exchange.sourceCurrency.id;
    if (!currenciesRateMap[sourceCurrencyId]) {
      currenciesRateMap[sourceCurrencyId] = [];
    }
    currenciesRateMap[sourceCurrencyId].push(exchange);
  });

  currencies.forEach((sourceCurrency) => {
    currencies.forEach((targetCurrency) => {
      if (sourceCurrency.id === targetCurrency?.id) return;

      const exchangeExists = currenciesRateMap[sourceCurrency.id].some(
        (exchange) => exchange.targetCurrency?.id === targetCurrency?.id
      );

      if (!exchangeExists) {
        const reverseExchange = currenciesRateMap[targetCurrency?.id]?.find(
          (exchange) => exchange.targetCurrency?.id === sourceCurrency.id
        );

        if (reverseExchange) {
          const originalBuyPrice = reverseExchange.price;
          const originalSellPrice = originalBuyPrice + reverseExchange.gap;
          const reverseBuyPrice = 1 / originalSellPrice;
          const reverseSellPrice = 1 / originalBuyPrice;
          const reverseGap = reverseSellPrice - reverseBuyPrice;

          currenciesRateMap[sourceCurrency.id].push({
            id: `calculated-${sourceCurrency.id}-${targetCurrency?.id}`,
            sourceCurrency,
            targetCurrency,
            price: 1 / reverseExchange.price,
            gap: reverseGap,
            reverse: true,
            createdAt: reverseExchange.createdAt,
            updatedAt: reverseExchange.updatedAt,
          });
        }
      }
    });
  });

  return currenciesRateMap;
};

const HeroSection: React.FC<HeroSectionProps> = () => (
  <div className="w-full h-[400px] overflow-hidden relative">
    <video
      width={"100%"}
      height={100}
      autoPlay
      muted
      loop
      className="w-full overflow-hidden object-cover"
    >
      <source src="/exchange.mp4"></source>
    </video>
    <div className="flex items-center bg-gray-800/70 absolute left-0 top-0 h-[400px] w-full justify-center z-10">
      <div className="grid grid-cols-12 container mx-auto max-w-screen-xl">
        <div className="flex flex-col col-span-8 space-y-4 mb-12">
          <h1 className="text-3xl text-yellow-400 font-bold tracking-tighter sm:text-4xl md:text-7xl mb-8">
            الصافي للصرافة والحوالات المالية
          </h1>
          <p className="max-w-[700px] text-background md:text-xl flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            استلام وارسال الحوالات المالية من كافة دول العالم
          </p>
          <p className="max-w-[700px] text-background md:text-xl flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            تصريف جميع العملات الأجنبية (دولار ، يورو ، تركي)
          </p>
          <p className="max-w-[700px] text-background md:text-xl flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            سحب وايداع من جميع المحفظات الالكترونية وبجميع العملات الرقمية
          </p>
          <div>
            <p className="max-w-[700px] text-background md:text-xl flex items-center gap-2">
              <MapPin className="w-6 h-6 text-green-500" />
              حلب - الجميلية - شارع جامع الصديق
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-end col-span-4">
          <a
            href="https://wa.me/963933333333"
            className="text-background md:text-xl w-max"
          >
            <Image
              src="/qrcode.svg"
              className="mx-auto"
              alt="whatsapp"
              width={200}
              height={200}
            />
          </a>
          <p className="text-background md:text-lg mt-4 w-max">
            تابعنا على واتساب لتصلك الأسعار اول باول 🔥
          </p>
        </div>
      </div>
    </div>
  </div>
);

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
  amount,
  setAmount,
  convertCurrency,
  setConvertCurrency,
  targetCurrency,
  setTargetCurrency,
  currencies,
  currenciesExchange,
  disabledCurrency,
  label,
}) => (
  <div className="flex items-center justify-between mb-4">
    <p className="font-medium text-2xl">{label}</p>
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <span className="text-xl font-semibold">
          {amount &&
            (generateCurrenciesRateMap(currencies, currenciesExchange)[
              targetCurrency
            ].find((ex) => ex.targetCurrency?.id === convertCurrency)?.price ??
              0) * amount}
        </span>
        <span>=</span>
      </div>
      <CurrencySelect
        value={convertCurrency}
        onChange={setConvertCurrency}
        currencies={currencies}
        disabledCurrency={disabledCurrency}
        placeholder="عملة التحويل"
      />
      <Input
        type="number"
        className="w-[100px]"
        value={amount ?? ""}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <div className="text-xl">
        <ArrowLeftRight />
      </div>
      <CurrencySelect
        value={targetCurrency}
        onChange={setTargetCurrency}
        currencies={currencies}
        disabledCurrency={disabledCurrency}
        placeholder="العملة الاساسية"
      />
    </div>
  </div>
);

const CurrencySelect: React.FC<CurrencySelectProps> = ({
  value,
  onChange,
  currencies,
  placeholder,
}) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent>
      {currencies.map((currency) => (
        <SelectItem
          // disabled={currency.id === disabledCurrency}
          key={currency.id}
          value={currency.id}
        >
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
);

const RateDisplay: React.FC<RateDisplayProps> = ({
  label,
  rate,
  symbol,
  bgColor,
}) => (
  <div className="flex items-center justify-between p-2 w-full">
    <div className="ms-2">
      <span className="text-xl">{label}</span>
    </div>
    <div
      className={`py-1 px-2 ${bgColor} rounded text-white text-xl font-bold tracking-[2]`}
    >
      <span className="me-2 text-base" dir="rtl">
        {symbol}
      </span>
      <span className="text-3xl font-semibold">{format({ value: rate })}</span>
    </div>
  </div>
);

const CurrencyCard: React.FC<CurrencyCardProps> = ({
  currency,
  rate,
  gap,
  targetCurrencySymbol,
}) => {
  console.log("currency", currency);
  return (
    <Card
      key={currency?.code}
      className="overflow-hidden border-2 hover:border-primary/50 transition-all py-1 border-green-700"
    >
      <CardContent className="p-2">
        <div className="flex flex-col items-center justify-between">
          <div className="flex items-center space-x-2 flex-col">
            <Image
              className="me-2"
              width={80}
              height={60}
              src={`/flags/${currency?.flag}.svg`}
              alt={currency?.name || ""}
            />
            <div>
              <h3 className="font-bold text-xl">{currency?.name}</h3>
            </div>
          </div>
          <RateDisplay
            label="شراء"
            rate={rate}
            symbol={targetCurrencySymbol}
            bgColor="bg-slate-400"
          />
          <RateDisplay
            label="بيع"
            rate={rate + gap}
            symbol={targetCurrencySymbol}
            bgColor="bg-blue-500"
          />
        </div>
      </CardContent>
    </Card>
  );
};
interface CurrencyExchangeHeroProps {
  currencies: Currency[];
  currenciesExchange: CurrencyExchange[];
  currentDate: string;
}

export default function CurrencyExchangeHero({
  currencies,
  currentDate,
  currenciesExchange,
}: CurrencyExchangeHeroProps) {
  const [amount, setAmount] = useState<number | null>(null);

  const [targetCurrency, setTargetCurrency] = useState<string>(
    currencies.find((c) => c.isMain)?.id || ""
  );

  const [targetCurrency2] = useState<string>(
    currencies.find((c) => c.code === "€")?.id || ""
  );

  const [convertCurrency, setConvertCurrency] = useState<string>(
    currencies.find((c) => c.code === "$")?.id || ""
  );

  const currenciesRateMap = generateCurrenciesRateMap(
    currencies,
    currenciesExchange
  );
  console.log(currenciesRateMap);
  const targetCurrencyData = currencies.find((c) => c.id === targetCurrency);
  // const targetCurrencyData2 = currencies.find((c) => c.id === targetCurrency2);

  const marqueeLogos: MarqueeLogoProps[] = [
    { src: "/logos/wu.jpg", title: "Western Union" },
    { src: "/logos/usdt.png", title: "USDT" },
    { src: "/logos/bnb.png", title: "BNB" },
    { src: "/logos/sham.png", title: "Sham" },
    { src: "/logos/whish.jpg", title: "Whish" },
    { src: "/logos/moneygram.png", title: "MoneyGram" },
  ];

  return (
    <section className="w-full bg-gradient-to-b from-muted/50 to-background pb-4">
      <HeroSection />

      <div className="container mx-auto px-4 mt-4">
        <CurrencyConverter
          amount={amount}
          setAmount={setAmount}
          convertCurrency={convertCurrency}
          setConvertCurrency={setConvertCurrency}
          targetCurrency={targetCurrency}
          setTargetCurrency={setTargetCurrency}
          currencies={currencies}
          currenciesExchange={currenciesExchange}
          disabledCurrency={targetCurrency2}
          label="العملة الاساسية"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 relative">
          {currenciesRateMap[targetCurrency].map((ex) => {
            return (
              <CurrencyCard
                key={ex?.targetCurrency?.code}
                currency={ex?.targetCurrency}
                rate={ex.price}
                gap={ex.gap}
                targetCurrencySymbol={targetCurrencyData?.symbol}
              />
            );
          })}
        </div>
      </div>

      {/* <div className="container mx-auto px-4 mt-12">
        <CurrencyConverter
          amount={amount}
          setAmount={setAmount}
          convertCurrency={convertCurrency}
          setConvertCurrency={setConvertCurrency}
          targetCurrency={targetCurrency2}
          setTargetCurrency={setTargetCurrency2}
          currencies={currencies}
          currenciesExchange={currenciesExchange}
          disabledCurrency={targetCurrency2}
          label="العملة الاساسية"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 relative">
          {generateCurrenciesRateMap(currencies, currenciesExchange)
            [targetCurrency2].filter(
              (ex) =>
                ex.targetCurrency?.id === targetCurrency2 ||
                ex.sourceCurrency.id === targetCurrency2
            )
            .map((ex) => {
              const isTarget = ex.targetCurrency?.id === targetCurrency2;
              const tc = isTarget
                ? currencies.find((c) => c.id === ex.sourceCurrency.id)
                : currencies.find((c) => c.id === ex.targetCurrency?.id);

              return (
                <CurrencyCard
                  key={tc?.code}
                  currency={tc}
                  rate={ex.price}
                  gap={ex.gap}
                  targetCurrencySymbol={targetCurrencyData2?.symbol}
                />
              );
            })}
        </div>
      </div> */}

      <div dir="ltr" className="my-12">
        <Marquee speed={200} autoFill>
          {marqueeLogos.map((logo, index) => (
            <Image
              key={index}
              src={logo.src}
              alt={logo.title}
              height={40}
              width={60}
              className="object-contain h-full w-auto mx-4"
            />
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
