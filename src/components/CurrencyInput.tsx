import React, { useState } from "react";
import { Input, Box } from "@chakra-ui/react";

const CURRENCY: any = {
  MATIC: "Ξ",
  ETH: "M",
  OPS: "OP",
  UMA: "UMA",
  COSMOS: "ATOM",
};

export const CurrencyInput = ({
  onPriceChange,
  onCurrencyChange,
  value,
  currency: _currency,
  labelText,
  labelFor,
  id,
  name,
}: // type,
// isRequired = false,
// placeholder,
// customClass
any) => {
  const [currency, setCurrency] = useState(_currency);

  const handleChangeCurrency = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCurrency(event.target.value);
    onCurrencyChange(event.target.value);
  };

  return (
    <Box className="my-5" bgColor="gray.500" borderRadius="lg">
      <label htmlFor={labelFor} className="sr-only">
        {labelText}
      </label>
      <Box className="mt-1 relative rounded-md shadow-sm">
        <Box className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 px-2 sm:text-sm">
            {CURRENCY[currency]}
          </span>
        </Box>
        <Input
          value={value}
          onChange={onPriceChange}
          name={name}
          id={id}
          className="rounded-md w-full py-2 block pl-12 pr-12 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10"
          placeholder="0.00"
        />
        <Box className="absolute inset-y-0 right-0 flex items-center">
          <label htmlFor="currency" className="sr-only">
            Currency
          </label>
          <select
            id="currency"
            name="currency"
            className=" border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10  h-full py-0 pl-2 pr-2  bg-transparent rounded-md"
            onChange={handleChangeCurrency}
            value={currency}
          >
            {Object.keys(CURRENCY).map((cur) => (
              <option key={cur}>{cur}</option>
            ))}
          </select>
        </Box>
      </Box>
    </Box>
  );
};
