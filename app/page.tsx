"use client";

import { useState, useEffect } from "react";
import { API_URL } from "@/config/api";
import CurrencyExchangeHero from "./currency/CurrencyExchange";
import { stringify } from "qs";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

// Create a stable QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 1000 * 60 * 2, // Refetch every 5 seconds
      refetchIntervalInBackground: true,
      staleTime: 0, // Data is always considered stale
      gcTime: 0, // Don't cache data
    },
  },
});

// Custom hook for fetching currencies
const useCurrencies = () => {
  return useQuery({
    queryKey: ["currencies"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/currencies`, {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch currencies");
      }
      const data = await response.json();
      return data.data;
    },
  });
};

// Custom hook for fetching currency exchanges
const useCurrencyExchanges = () => {
  return useQuery({
    queryKey: ["currencyExchanges"],
    queryFn: async () => {
      const qsExchange = stringify({
        populate: "*",
      });
      const response = await fetch(
        `${API_URL}/currency-exchanges?${qsExchange}`,
        {
          cache: "no-store",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch currency exchanges");
      }
      const data = await response.json();
      return data.data;
    },
  });
};

// Main component that uses the queries
function CurrencyExchangeApp() {
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const {
    data: currencies = [],
    isLoading: currenciesLoading,
    error: currenciesError,
    isFetching: currenciesFetching,
  } = useCurrencies();

  const {
    data: currencyExchanges = [],
    isLoading: exchangesLoading,
    error: exchangesError,
    isFetching: exchangesFetching,
  } = useCurrencyExchanges();

  // Update current date every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date().toISOString().split("T")[0]);
    }, 1000 * 60 * 2);

    return () => clearInterval(interval);
  }, []);

  // Show loading state
  if (currenciesLoading || exchangesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-muted/50 to-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-foreground">
            جاري تحميل أسعار العملات...
          </h2>
          <p className="text-muted-foreground mt-2">يرجى الانتظار قليلاً</p>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>سيتم تحديث البيانات تلقائياً كل دقيقتين</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (currenciesError || exchangesError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-muted/50 to-background">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            خطأ في تحميل البيانات
          </h2>
          <p className="text-muted-foreground mb-4">
            {currenciesError?.message || exchangesError?.message}
          </p>
          <button
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ["currencies"] });
              queryClient.invalidateQueries({
                queryKey: ["currencyExchanges"],
              });
            }}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <CurrencyExchangeHero
      currencies={currencies}
      currenciesExchange={currencyExchanges}
      currentDate={currentDate}
      isLoading={currenciesFetching || exchangesFetching}
    />
  );
}

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <CurrencyExchangeApp />
    </QueryClientProvider>
  );
}
