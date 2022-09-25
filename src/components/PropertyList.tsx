import { Box, Text, Image } from "@chakra-ui/react";
import { ethers } from "ethers";
import type { Property } from "../types";

type PropertyListProps = {
  properties: Property[];
};

const CURRENCY: any = {
  ETH: "Ξ",
  MTC: "MATIC",
  OPS: "OP",
  UMA: "UMA",
  COSMOS: "ATOM",
};

export const PropertyList = ({ properties }: PropertyListProps) => {
  const getPrice = (price: any, currency: string) => {
    if (currency === "ETH") {
      return ethers.utils.formatEther(price);
    } else {
      return String(price.toNumber()).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  };

  return (
    <Box mx="10%" className="mt-4">
      <ul className="flex flex-col gap-4 object-contain">
        {properties.map((property) => (
          <li className="mb-16" key={property.id.toNumber()}>
            <Text className="font-medium leading-tight text-xl mt-2 mb-1">
              {property.name}
            </Text>
            <Text className="text-sm mb-4 underline">{property.location}</Text>
            <Box className="flex flex-row gap-4 max-h-96">
              <Box className="flex-1">
                {property.images.slice(0, 1).map((image) => (
                  <Image
                    rounded="lg"
                    shadow="lg"
                    src={image}
                    key={image}
                    alt={property.description}
                    className="h-[102%] w-full"
                  />
                ))}
              </Box>
              <Box className="flex-1 flex flex-wrap gap-2 max-h-full">
                {property.images.slice(1).map((image) => (
                  <Image
                    rounded="lg"
                    shadow="lg"
                    src={image}
                    key={image}
                    className="w-5/12 h-3/6"
                    alt={property.description}
                  />
                ))}
              </Box>
            </Box>
            <Text className="font-medium leading-tight text-xl mt-4 mb-1">
              Descriptions
            </Text>
            <Text className="font-xs leading-tight text-base mt-4 mb-4">
              {property.description}
            </Text>
            <Text className="font-medium leading-tight text-xl mt-4 mb-1">
              Price
            </Text>
            <Text>
              <span className="mr-2">{CURRENCY[property.currency]}</span>
              <span>{getPrice(property.price, property.currency)}</span>
            </Text>
          </li>
        ))}
      </ul>
    </Box>
  );
};
