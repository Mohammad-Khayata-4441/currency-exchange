import { API_URL } from "@/config/api";
import CurrencyExchangeHero from "./currency/CurrencyExchange";
import { stringify } from "qs";

export default async function Home() {
  const currentDate = new Date().toISOString().split("T")[0];

  const qsExchange = stringify({
    populate: "*",
  });
  const currenciesResponse = await fetch(`${API_URL}/currencies`, {
    cache: "no-cache",
  });
  const currencyExchangesResponse = await fetch(
    `${API_URL}/currency-exchanges?${qsExchange}`
  );

  const currencies = await currenciesResponse.json();
  const currencyExchanges = await currencyExchangesResponse.json();

  return (
    <CurrencyExchangeHero
      currencies={currencies.data}
      currenciesExchange={currencyExchanges.data}
      currentDate={currentDate}
    />
  );
}
