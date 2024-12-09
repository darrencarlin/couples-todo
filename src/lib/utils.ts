import { BASE_URL } from "@/constants";
import { clsx, type ClassValue } from "clsx";
import { addDays, isAfter, isBefore, isSameDay, isToday } from "date-fns";
import { twMerge } from "tailwind-merge";

export const isDateToday = (planDate: Date, currentDate: Date = new Date()) =>
  isToday(planDate);

export const isDatePast = (planDate: Date, currentDate: Date = new Date()) =>
  isBefore(planDate, currentDate) && !isSameDay(planDate, currentDate);

export const isDateWithinWeek = (
  planDate: Date,
  currentDate: Date = new Date()
) => {
  const oneWeekLater = addDays(currentDate, 7);
  return isAfter(planDate, currentDate) && !isAfter(planDate, oneWeekLater);
};

export const isDateFuture = (planDate: Date, currentDate: Date = new Date()) =>
  isAfter(planDate, currentDate);

export const formatDate = (date: Date) => {
  return new Date(date).toISOString().split("T")[0];
};

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const pluralize = (str: string) => {
  return str + "s";
};

export const singularize = (str: string) => {
  if (str.endsWith("s")) {
    return str.slice(0, -1);
  }

  return str;
};

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

/**
 * Gets the error message from an error object, handles different cases.
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === "object" && "message" in error) {
    return (error as { message: string }).message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "An error occurred, please try again.";
};

// Custom Fetch Function for API calls

type FetchOptions = RequestInit & {
  next?: NextFetchRequestConfig;
};

const isLocalhost =
  typeof window !== "undefined" && window.location.hostname === "localhost";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const log = (message: string, data?: any) => {
  if (isLocalhost) {
    console.log(message, data);
  }
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const logError = (message: string, data?: any) => {
  if (isLocalhost) {
    console.error(message, data);
  }
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const logDebug = (message: string, data?: any) => {
  if (isLocalhost) {
    console.debug(message, data);
  }
};

export async function fetchApi<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const { next, ...fetchOptions } = options;
  const fullUrl = `${BASE_URL}${url}`;

  log(`Initiating API call to: ${fullUrl}`, { options: fetchOptions });

  try {
    const response = await fetch(fullUrl, {
      ...fetchOptions,
      next: next ? { revalidate: next.revalidate } : undefined,
    });

    log(`Received response from: ${fullUrl}`, {
      status: response.status,
      statusText: response.statusText,
    });

    if (!response.ok) {
      logError(`HTTP error for: ${fullUrl}`, {
        status: response.status,
        statusText: response.statusText,
      });
      return {} as T;
    }

    const data = await response.json();
    logDebug(`Parsed JSON response from: ${fullUrl}`, { data });

    return data;
  } catch (error: unknown) {
    logError(`Error in API call to: ${fullUrl}`, {
      error,
      message: (error as Error).message,
      cause: (error as Error).cause,
      stack: (error as Error).stack,
    });

    return {} as T;
  }
}

export const darkenHex = (hex: string, percentage: number): string => {
  // Remove the # if present and ensure the hex is valid
  const cleanHex = hex.replace(/^#/, "");

  // Validate hex length (should be 3 or 6 characters)
  if (!/^([0-9A-Fa-f]{3}){1,2}$/.test(cleanHex)) {
    throw new Error("Invalid hex color");
  }

  // Handle 3-digit hex codes by expanding them
  const fullHex =
    cleanHex.length === 3
      ? cleanHex
          .split("")
          .map((char) => char + char)
          .join("")
      : cleanHex;

  // Convert percentage to a value between 0 and 255
  const darkenAmount = Math.round((percentage / 100) * 255);

  // Process each color channel
  const darkenedHex = fullHex
    .match(/.{2}/g)!
    .map((channel) => {
      const channelValue = Math.max(
        0,
        Math.min(255, parseInt(channel, 16) - darkenAmount)
      );
      return channelValue.toString(16).padStart(2, "0");
    })
    .join("");

  return `#${darkenedHex}`;
};

export const lightenHex = (hex: string, percentage: number): string => {
  // Remove the # if present and ensure the hex is valid
  const cleanHex = hex.replace(/^#/, "");

  // Validate hex length (should be 3 or 6 characters)
  if (!/^([0-9A-Fa-f]{3}){1,2}$/.test(cleanHex)) {
    throw new Error("Invalid hex color");
  }

  // Handle 3-digit hex codes by expanding them
  const fullHex =
    cleanHex.length === 3
      ? cleanHex
          .split("")
          .map((char) => char + char)
          .join("")
      : cleanHex;

  // Convert percentage to a value between 0 and 255
  const lightenAmount = Math.round((percentage / 100) * 255);

  // Process each color channel
  const lightenedHex = fullHex
    .match(/.{2}/g)!
    .map((channel) => {
      const channelValue = Math.max(
        0,
        Math.min(255, parseInt(channel, 16) + lightenAmount)
      );
      return channelValue.toString(16).padStart(2, "0");
    })
    .join("");

  return `#${lightenedHex}`;
};
