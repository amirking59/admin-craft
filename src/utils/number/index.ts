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
