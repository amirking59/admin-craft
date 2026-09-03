import dayjs, { Dayjs } from "dayjs";
export { cn } from "cn";

export const convertCase = (
  str = "",
  toCase: "camel" | "snake" | "pascal" | "kebab" | "title" | "sentence" = "camel",
) => {
  if (!str) return "";

  const delimiter =
    toCase === "snake" ? "_" : toCase === "kebab" ? "-" : ["title", "sentence"].includes(toCase) ? " " : "";

  const transform = ["camel", "pascal"].includes(toCase)
    ? (x: string) => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase()
    : ["snake", "kebab"].includes(toCase)
      ? (x: string) => x.toLowerCase()
      : toCase === "title"
        ? (x: string) => x.slice(0, 1).toUpperCase() + x.slice(1)
        : (x: string) => x;

  const finalTransform =
    toCase === "camel"
      ? (x: string) => x.slice(0, 1).toLowerCase() + x.slice(1)
      : toCase === "sentence"
        ? (x: string) => x.slice(0, 1).toUpperCase() + x.slice(1)
        : (x: string) => x;

  const words = str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g) || [];

  return finalTransform(words.map(transform).join(delimiter));
};

export const formatDate = (date?: string | Date | Dayjs | null, showTime = true): string => {
  if (!date) return "";

  return dayjs(date).format(`YYYY/MM/DD${showTime ? " HH:mm:ss" : ""}`);
};

export const humanizeDuration = (date: string | Date | Dayjs) => {
  return dayjs.duration(dayjs(date).diff(dayjs())).humanize(true);
};

/**
 * Returns the keys of an enum
 * @param e The enum object
 * @returns Array of enum keys
 */
export function getEnumKeys<T extends object>(e: T): Array<keyof T> {
  const keys = Object.keys(e) as Array<keyof T>;

  return keys;
}

/**
 * Returns the values of an enum
 * @param e The enum object
 * @returns Array of enum values
 */
export function getEnumValues<T extends object, K extends keyof T = keyof T>(e: T): Array<T[K]> {
  const values = Object.values(e) as Array<T[K]>;

  return values;
}

export const formatNumber = (number = 0, decimalPlaces = 0, compact = false, forceDecimals = false): string => {
  // Create the formatter
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: forceDecimals ? decimalPlaces : 0,
    maximumFractionDigits: decimalPlaces,
    roundingMode: "floor",
    compactDisplay: "short",
    notation: compact ? "compact" : "standard",
  });

  // Format the number
  let formattedNumber = formatter.format(number);

  // Remove trailing zeros only when forceDecimals is false
  if (!forceDecimals) {
    formattedNumber = formattedNumber
      .replace(/(\.\d*[1-9])0+|\.0*$/, "$1") // Remove unnecessary zeros after decimals
      .replace(/\.0+([KMBT])$/, "$1"); // Remove ".0" if it's before "K", "M", "B", "T"
  }

  return formattedNumber;
};
