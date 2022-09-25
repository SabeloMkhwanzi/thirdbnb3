import React, { Fragment, useState, useEffect, useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import { ethers, Signer } from "ethers";
import { Dialog, Transition } from "@headlessui/react";
import { Provider } from "../utils/provider";
import AirBlockArtifact from "../artifacts/contracts/AirBlock.sol/AirBlock.json";
import { contractAddress } from "./address";
import { Booking, Property } from "../types";

import { Button } from "@chakra-ui/react";

type ConfirmCancelBookingModalProps = {
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
  booking: Booking | null;
  property: Property | null;
};

export const ConfirmCancelBookingModal = ({
  onClose,
  isOpen,
  booking,
  property,
}: ConfirmCancelBookingModalProps) => {
  const context = useWeb3React<Provider>();
  const { library } = context;
  const [signer, setSigner] = useState<Signer>();
  const [cancelling, setCancelling] = useState(false);

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

  const handleCancelBooking = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (!signer || !airBlockContract || !booking) return;

    setCancelling(true);

    const tx = await airBlockContract
      .connect(signer)
      .deleteBooking(booking.bookingId);
    await tx.wait();

    setCancelling(false);
    onClose();
  };

  useEffect(() => {
    if (!signer || !airBlockContract) return;
  }, [airBlockContract, signer]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Confirm cancellation
                </Dialog.Title>
                <p className="mt-8 mb-8">
                  Are you sure you want to cancel booking in{" "}
                  {property && property.location} from{" "}
                  {booking && new Date(booking.checkInDate).toDateString()} to{" "}
                  {booking && new Date(booking.checkOutDate).toDateString()}?
                </p>
                <div className="mt-4 flex gap-4">
                  <Button
                    colorScheme="teal"
                    variant="outline"
                    fontSize={{ base: "ms", md: "md" }}
                    cursor="pointer"
                    textAlign="center"
                    borderColor="teal"
                    borderRadius="2xl"
                    maxW="100%"
                    disabled={cancelling}
                    onClick={handleCancelBooking}
                  >
                    {cancelling ? (
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
                    Cancel
                  </Button>
                  <Button
                    colorScheme="teal"
                    variant="outline"
                    fontSize={{ base: "ms", md: "md" }}
                    cursor="pointer"
                    textAlign="center"
                    borderColor="teal"
                    borderRadius="2xl"
                    maxW="100%"
                    onClick={onClose}
                  >
                    Close
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
