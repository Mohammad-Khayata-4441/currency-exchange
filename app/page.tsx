"use client";

import { useState, useEffect } from "react";
import CurrencyExchangeHero from "./currency/CurrencyExchange";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { fetchCurrencies, fetchCurrencyExchanges } from "./actions/currency";

// MAXIMUM 4K requests per month

const POLLING_DURATION = 1000 * 60 * 2000; // 2 hour
// Create a stable QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: POLLING_DURATION, // Refetch every 2 minutes
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
      const result = await fetchCurrencies();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
};

// Custom hook for fetching currency exchanges
const useCurrencyExchanges = () => {
  return useQuery({
    queryKey: ["currencyExchanges"],
    queryFn: async () => {
      const result = await fetchCurrencyExchanges();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
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
    refetch: refetchCurrencies,
  } = useCurrencies();

  const {
    data: currencyExchanges = [],
    isLoading: exchangesLoading,
    error: exchangesError,
    isFetching: exchangesFetching,
    refetch: refetchExchanges,
  } = useCurrencyExchanges();

  const handleManualRefresh = async () => {
    setCurrentDate(new Date().toISOString().split("T")[0]);
    await Promise.all([refetchCurrencies(), refetchExchanges()]);
  };

  // Update current date every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date().toISOString().split("T")[0]);
    }, POLLING_DURATION);

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
            <p>سيتم تحديث البيانات تلقائياً كل ساعتين</p>
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
      onRefresh={handleManualRefresh}
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
