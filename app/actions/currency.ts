"use server";

import { API_URL } from "@/config/api";
import { stringify } from "qs";

export async function fetchCurrencies() {
    try {
        const response = await fetch(`${API_URL}/currencies`, {
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch currencies");
        }

        const data = await response.json();
        return { success: true, data: data.data };
    } catch (error) {
        console.error("Error fetching currencies:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
        };
    }
}

export async function fetchCurrencyExchanges() {
    try {
        const qsExchange = stringify({
            populate: "*",
        });

        const response = await fetch(`${API_URL}/currency-exchanges?${qsExchange}`, {
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch currency exchanges");
        }

        const data = await response.json();
        return { success: true, data: data.data };
    } catch (error) {
        console.error("Error fetching currency exchanges:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
        };
    }
} 