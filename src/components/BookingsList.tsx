import React, { useState } from "react";
import { ethers } from "ethers";
import type { Booking, Property } from "../types";

import {
  Box,
  Image,
  Text,
  Button,
  HStack,
  VStack,
  SimpleGrid,
} from "@chakra-ui/react";
import { CreateFlow } from "./Streaming/CreateFlow";
import Create from "./Minter/create";

type BookingsListProps = {
  bookings: Booking[];
  properties: Property[];
  onClickModify: (booking: Booking) => Promise<any>;
  onClickConfirm: (booking: Booking) => Promise<any>;
  onClickCancel: (booking: Booking) => Promise<any>;
};

const CURRENCY: any = {
  ETH: "Ξ",
  MTC: "MATIC",
  OPS: "OP",
  UMA: "UMA",
  COSMOS: "ATOM",
};

export const BookingsList = ({
  bookings,
  properties,
  onClickModify,
  onClickConfirm,
  onClickCancel,
}: BookingsListProps) => {
  const [modifyings, setModifyings] = useState<{ [key: string]: boolean }>({});
  const [cancelings, setCancelings] = useState<{ [key: string]: boolean }>({});
  const [confirmings, setConfirmings] = useState<{ [key: string]: boolean }>(
    {}
  );

  const getPrice = (price: any, currency: string) => {
    if (currency === "ETH") {
      return ethers.utils.formatEther(price);
    } else {
      return String(price.toNumber()).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  };

  const handleConfirmBooking = async (
    e: React.MouseEvent<HTMLButtonElement>,
    booking: Booking
  ) => {
    setConfirmings((oldConfirmings) => ({
      ...oldConfirmings,
      [booking.bookingId.toNumber()]: true,
    }));

    const tx = await onClickConfirm(booking);

    await tx.wait();

    setConfirmings((oldConfirmings) => ({
      ...oldConfirmings,
      [booking.bookingId.toNumber()]: false,
    }));
  };

  const handleModifyBooking = async (
    e: React.MouseEvent<HTMLButtonElement>,
    booking: Booking
  ) => {
    setModifyings((oldModifyings) => ({
      ...oldModifyings,
      [booking.bookingId.toNumber()]: true,
    }));

    await onClickModify(booking);

    setModifyings((oldModifyings) => ({
      ...oldModifyings,
      [booking.bookingId.toNumber()]: false,
    }));
  };

  const handleCancelBooking = async (
    e: React.MouseEvent<HTMLButtonElement>,
    booking: Booking
  ) => {
    setCancelings((oldCancelings) => ({
      ...oldCancelings,
      [booking.bookingId.toNumber()]: true,
    }));

    await onClickCancel(booking);

    setCancelings((oldCancelings) => ({
      ...oldCancelings,
      [booking.bookingId.toNumber()]: false,
    }));
  };

  if (properties.length === 0 || bookings.length === 0) return null;

  return (
    <Box mx="10%" className="mt-4">
      <Text as="h2" className="font-medium leading-tight text-4xl mt-2 mb-1">
        User Dashboard
      </Text>
      <ul className="flex flex-col gap-4 max-w-screen-xl object-contain">
        {bookings.map((booking) => (
          <li className="mb-16" key={booking.bookingId.toNumber()}>
            <Text
              as="h5"
              className="font-medium leading-tight text-xl mt-2 mb-1"
            >
              {properties[booking.propertyId.toNumber()].name}
            </Text>
            <Text as="p" className="text-sm mb-4 underline">
              {properties[booking.propertyId.toNumber()].location}
            </Text>
            <Box className="flex flex-row gap-4">
              <Box className="flex-1">
                {properties[booking.propertyId.toNumber()].images
                  .slice(0, 1)
                  .map((image) => (
                    <Image
                      rounded="lg"
                      shadow="lg"
                      src={image}
                      key={image}
                      alt={
                        properties[booking.propertyId.toNumber()].description
                      }
                      className=""
                    />
                  ))}
              </Box>
              <Box className="flex-1 flex flex-wrap gap-2 max-h-full">
                {properties[booking.propertyId.toNumber()].images
                  .slice(1)
                  .map((image) => (
                    <Image
                      rounded="lg"
                      shadow="lg"
                      src={image}
                      key={image}
                      className="w-5/12 h-3/6"
                      alt={
                        properties[booking.propertyId.toNumber()].description
                      }
                    />
                  ))}
              </Box>
            </Box>
            <Box className="font-medium mt-4">
              <Text as="p">
                <Text as="b" color="GrayText" className="font-medium mr-2">
                  Check-in Date:
                </Text>
                <Text as="kbd" textDecoration="underline">
                  {new Date(booking.checkInDate).toDateString()}
                </Text>
              </Text>

              <Text>
                <Text color="GrayText" as="b" className="font-medium mr-2">
                  Check-out Date:
                </Text>
                <Text as="kbd" textDecoration="underline">
                  {new Date(booking.checkOutDate).toDateString()}
                </Text>
              </Text>
            </Box>

            <Text>
              <span>
                <span className="font-medium mr-2">Total:</span>
                <span className="mr-2">
                  {CURRENCY[properties[booking.propertyId.toNumber()].currency]}{" "}
                </span>
                {getPrice(
                  booking.totalPrice,
                  properties[booking.propertyId.toNumber()].currency
                )}
              </span>
            </Text>
            <div className="mt-4 flex gap-2">
              {booking.isConfirmed === false && booking.isDeleted === false ? (
                <Button
                  colorScheme="teal"
                  variant="outline"
                  fontSize={{ base: "ms", md: "md" }}
                  cursor="pointer"
                  textAlign="center"
                  borderColor="teal"
                  borderRadius="2xl"
                  maxW="100%"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                    handleConfirmBooking(e, booking)
                  }
                >
                  {confirmings[booking.bookingId.toNumber()] ? (
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : null}
                  Confirm reservation
                </Button>
              ) : null}
              {booking.isConfirmed === false && booking.isDeleted === false ? (
                <Button
                  colorScheme="teal"
                  variant="outline"
                  fontSize={{ base: "ms", md: "md" }}
                  cursor="pointer"
                  textAlign="center"
                  borderColor="teal"
                  borderRadius="2xl"
                  maxW="100%"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                    handleModifyBooking(e, booking)
                  }
                >
                  {modifyings[booking.bookingId.toNumber()] ? (
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : null}
                  Modify
                </Button>
              ) : null}
              {booking.isConfirmed === false && booking.isDeleted === false ? (
                <Button
                  colorScheme="red"
                  variant="outline"
                  fontSize={{ base: "ms", md: "md" }}
                  cursor="pointer"
                  textAlign="center"
                  borderColor="red.400"
                  borderRadius="2xl"
                  maxW="100%"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                    handleCancelBooking(e, booking)
                  }
                >
                  {cancelings[booking.bookingId.toNumber()] ? (
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-red"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : null}
                  Cancel
                </Button>
              ) : null}
              {booking.isConfirmed ? (
                <>
                  <VStack>
                    <Button
                      colorScheme="teal"
                      variant="outline"
                      fontSize={{ base: "ms", md: "md" }}
                      cursor="pointer"
                      textAlign="center"
                      borderColor="teal"
                      borderRadius="2xl"
                      maxW="100%"
                      left="-30%"
                      mb="3"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Confirmed booking
                    </Button>

                    <SimpleGrid columns={[1, null, 2]} spacing={2}>
                      <Box height="500">
                        <CreateFlow />
                      </Box>
                      <Box height="500">
                        <Create />
                      </Box>
                    </SimpleGrid>
                  </VStack>
                </>
              ) : null}
              {booking.isDeleted ? (
                <Button
                  colorScheme="red"
                  variant="outline"
                  fontSize={{ base: "ms", md: "md" }}
                  cursor="pointer"
                  textAlign="center"
                  borderColor="red.400"
                  borderRadius="2xl"
                  maxW="100%"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Cancelled Booking
                </Button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </Box>
  );
};
