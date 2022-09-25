import { useState, useMemo, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { ethers, Signer } from "ethers";
import { ListingModal } from "./ListingModal";
import { Provider } from "../utils/provider";
import { PropertyList } from "./PropertyList";
import AirBlockArtifact from "../artifacts/contracts/AirBlock.sol/AirBlock.json";
import type { Property } from "../types";
import { contractAddress } from "./address";
import { Button, Box, Text, VStack } from "@chakra-ui/react";

export const Listings = () => {
  const context = useWeb3React<Provider>();
  const { library, active } = context;
  const [signer, setSigner] = useState<Signer>();
  const [isOpen, setIsOpen] = useState(false);
  const [listedProperties, setListedProperties] = useState<Property[]>([]);

  const airBlockContract = useMemo(() => {
    return new ethers.Contract(contractAddress, AirBlockArtifact.abi, signer);
  }, [signer]);

  useEffect((): void => {
    if (!library) {
      setSigner(undefined);
      return;
    }

    setSigner(library.getSigner());
  }, [library]);

  useEffect(() => {
    if (!signer) return;

    try {
      airBlockContract
        .connect(signer)
        .getPropertiesForOwner()
        .then((properties: Property[]) =>
          properties.filter((p: Property) => p.name)
        )
        .then(setListedProperties);
    } catch (err) {
      // console.log(err);
    }

    airBlockContract.connect(signer).on("NewProperty", async (propertyId) => {
      airBlockContract
        .connect(signer)
        .getPropertiesForOwner()
        .then((properties: Property[]) =>
          properties.filter((p: Property) => p.name)
        )
        .then(setListedProperties);
    });
  }, [airBlockContract, signer]);

  const createListingButton = useMemo(() => {
    return active ? (
      <Button
        colorScheme="teal"
        variant="outline"
        fontSize={{ base: "ms", md: "md" }}
        cursor="pointer"
        textAlign="center"
        borderColor="teal"
        borderRadius="2xl"
        maxW="100%"
        onClick={() => setIsOpen(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        New Listing
      </Button>
    ) : null;
  }, [setIsOpen, active]);

  return (
    // <Box className="max-w-screen-xl px-2 sm:px-6 lg:px-8">
    //   <Box className="flex gap-4 items-center">

    <Box
      mt="5%"
      p="12%"
      alignItems="center"
      justifyContent="space-between"
      borderWidth={1}
      borderColor="gray.650"
      borderRadius="lg"
      mx="5%"
      className="px-2 sm:px-4 lg:px-3"
      bg="white"
      _dark={{ bg: "gray.900" }}
    >
      <VStack height="100%">
        <Text
          className="text-2xl font-bold leading-7  sm:text-1xl sm:truncate"
          p={5}
        >
          Become A Host
        </Text>
        {createListingButton}
      </VStack>
      <ListingModal
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        isOpen={isOpen}
      />
      <PropertyList properties={listedProperties} />
    </Box>
  );
};
