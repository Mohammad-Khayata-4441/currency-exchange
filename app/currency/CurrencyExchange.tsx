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
import { ArrowLeftRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
        <div className="flex flex-col col-span-9 space-y-4 mb-12">
          {/*        <h1 className="text-3xl text-yellow-400 font-bold tracking-tighter sm:text-4xl md:text-7xl mb-8">
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
          </p> */}
          <Image
            src="/logo.png"
            className="mx-auto w-full"
            alt="logo"
            width={1000}
            height={1000}
            quality={100}
          />
          {/* 
          <div>
            <p className=" text-background md:text-xl flex items-center gap-2   justify-center">
              <MapPin className="w-6 h-6 text-green-500" />
              حلب - الجميلية - شارع جامع الصديق
            </p>
          </div>
           */}
        </div>
        <div className="flex flex-col items-center justify-center col-span-3">
          <a
            href="https://wa.me/963933333333"
            className="text-background md:text-xl w-max"
          >
            <Image
              src="/qrcode.svg"
              className="mx-auto"
              alt="whatsapp"
              width={150}
              height={150}
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

const calculateAmount = (
  amount: number | null,
  mode: "sell" | "buy",
  rateMap: CurrencyExchange
) => {
  if (!amount || !rateMap) return 0;
  if (mode === "sell") {
    return (rateMap?.price + rateMap.gap) * amount;
  }
  return rateMap?.price * amount;
};

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
}) => {
  const [mode, setMode] = useState<"sell" | "buy">("sell");
  const rateMap = generateCurrenciesRateMap(currencies, currenciesExchange)[
    targetCurrency
  ]?.find((ex) => ex.targetCurrency?.id === convertCurrency);

  const calculatedAmount = calculateAmount(
    amount,
    mode,
    rateMap as CurrencyExchange
  );

  return (
    <div className="flex items-center justify-between mb-4">
      <p className="font-medium text-2xl">{label}</p>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold">
            {calculatedAmount}{" "}
            {currencies.find((c) => c.id === targetCurrency)?.symbol}
          </span>
          <span>=</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className={`px-3 py-1 rounded- ${mode === "sell" ? "bg-primary text-white" : "bg-gray-200"
              }`}
            onClick={() => setMode("sell")}
          >
            بيع
          </button>
          <button
            className={`px-3 py-1 rounded-l ${mode === "buy" ? "bg-primary text-white" : "bg-gray-200"
              }`}
            onClick={() => setMode("buy")}
          >
            شراء
          </button>
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
};

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
        <div className="flex flex-col ">
          <div className="flex space-x-2 ps-4 items-center">
            <Image
              className="me-4 rounded"
              width={80}
              height={50}
              src={`/flags/${currency?.flag}.svg`}
              alt={currency?.name || ""}
            />
            <div>
              <h3 className="font-bold text-xl">
                {currency?.name}{" "}
                <span className="text-2xl font-normal">
                  {" "}
                  ({currency?.code})
                </span>
              </h3>
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
  isLoading?: boolean;
  onRefresh?: () => void;
}

export default function CurrencyExchangeHero({
  currencies,
  currentDate,
  currenciesExchange,
  isLoading = false,
  onRefresh,
}: CurrencyExchangeHeroProps) {
  const [amount, setAmount] = useState<number | null>(null);

  const [targetCurrency, setTargetCurrency] = useState<string>(
    currencies.find((c) => c.isMain)?.id || ""
  );

  const [convertCurrency, setConvertCurrency] = useState<string>(
    currencies.find((c) => c.code === "$")?.id || ""
  );

  const currenciesRateMap = generateCurrenciesRateMap(
    currencies,
    currenciesExchange
  );
  const targetCurrencyData = currencies.find((c) => c.id === targetCurrency);
  // const targetCurrencyData2 = currencies.find((c) => c.id === targetCurrency2);



  return (
    <section className="w-full bg-gradient-to-b from-muted/50 to-background pb-4">
      <HeroSection />

      <div className="container mx-auto px-4 mt-4 max-w-screen-xl">
        <CurrencyConverter
          amount={amount}
          setAmount={setAmount}
          convertCurrency={convertCurrency}
          setConvertCurrency={setConvertCurrency}
          targetCurrency={targetCurrency}
          setTargetCurrency={setTargetCurrency}
          currencies={currencies}
          currenciesExchange={currenciesExchange}
          disabledCurrency={targetCurrency}
          label="العملة الاساسية"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 relative">
          {currenciesRateMap[targetCurrency]
            ?.filter((ex) => !ex.reverse)
            .map((ex) => {
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

        {currenciesRateMap[targetCurrency]?.filter((ex) => ex.reverse).length >
          0 && (
            <Table className="mt-4 overflow-hidden">
              <TableCaption className="text-lg">
                A list of your recent invoices.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]"></TableHead>
                  <TableHead className="text-right text-xl">العملة</TableHead>
                  <TableHead className="text-center text-xl">بيع</TableHead>
                  <TableHead className="text-center text-xl">شراء</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currenciesRateMap[targetCurrency]
                  ?.filter((ex) => ex.reverse)
                  .map((ex) => (
                    <TableRow key={ex.id}>
                      <TableCell className="font-medium">
                        <Image
                          className="me-2 rounded"
                          height={15}
                          width={30}
                          src={`/flags/${ex.targetCurrency?.flag}.svg`}
                          alt={ex.targetCurrency?.name || ""}
                        />
                      </TableCell>

                      <TableCell className="text-lg">
                        {ex.targetCurrency.name}
                      </TableCell>
                      <TableCell className="text-center text-lg">
                        {ex.price} {targetCurrencyData?.symbol}
                      </TableCell>
                      <TableCell className="text-center text-lg">
                        {ex.price + ex.gap} {targetCurrencyData?.symbol}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
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



      <div className="mt-8 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-2">
          <p>اخر تحديث للأسعار بتاريخ : {currentDate}</p>
          {isLoading && (
            <div className="flex items-center gap-1 text-primary">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="text-xs">جاري التحديث...</span>
            </div>
          )}
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "جاري التحديث..." : "تحديث الأسعار الآن"}
          </button>
        )}
        {/* <p className="mt-1 text-lg">حلب - الجميلية - شارع جامع الصديق</p> */}
      </div>
    </section>
  );
}
