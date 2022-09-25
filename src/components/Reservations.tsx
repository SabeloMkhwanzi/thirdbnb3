import { useState, useEffect, useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import { ethers, Signer } from "ethers";
import { Provider } from "../utils/provider";
import { BookingsList } from "./BookingsList";
import AirBlockArtifact from "../artifacts/contracts/AirBlock.sol/AirBlock.json";
import type { Property, Booking } from "../types";
import { contractAddress } from "./address";
import { ConfirmCancelBookingModal } from "./ConfirmCancelBookingModal";
import { ConfirmModifyBookingModal } from "./ConfirmModifyBookingModal";
import { Box } from "@chakra-ui/react";

export const Reservations = () => {
  const context = useWeb3React<Provider>();
  const { library } = context;
  const [signer, setSigner] = useState<Signer>();
  const [signerAddr, setSignerAddr] = useState<string | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isOpenCancellationModal, setIsOpenCancellationModal] = useState(false);
  const [isOpenModificationModal, setIsOpenModificationModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const airBlockContract = useMemo(() => {
    return new ethers.Contract(contractAddress, AirBlockArtifact.abi, signer);
  }, [signer]);

  useEffect((): void => {
    if (!library) {
      setSigner(undefined);
      return;
    }

    const signer = library.getSigner();
    setSigner(signer);
    signer.getAddress().then(setSignerAddr);
  }, [library]);

  useEffect(() => {
    if (!signer) return;

    const connectedContract = airBlockContract.connect(signer);

    connectedContract
      .getBookingsForTenant()
      .then((bookings: Booking[]) => bookings.filter((b) => b.checkInDate))
      .then(setBookings);
    connectedContract.getAllProperties().then(setProperties);

    connectedContract.on("NewProperty", async () => {
      connectedContract.getAllProperties().then(setProperties);
    });

    connectedContract.on("ConfirmBooking", async () => {
      connectedContract.getBookingsForTenant().then(setBookings);
    });

    connectedContract.on("CancelBooking", async () => {
      connectedContract.getBookingsForTenant().then(setBookings);
    });

    connectedContract.on("ModifyBooking", async () => {
      connectedContract.getBookingsForTenant().then(setBookings);
    });
  }, [airBlockContract, signer, signerAddr]);

  const handleCancelBooking = async (booking: Booking): Promise<any> => {
    if (!signer || !airBlockContract) return Promise.reject();

    await setSelectedBooking(booking);
    await setIsOpenCancellationModal(true);

    return Promise.resolve();
  };

  const handleModifyBooking = async (booking: Booking): Promise<any> => {
    if (!signer || !airBlockContract) return Promise.reject();

    await setSelectedBooking(booking);
    await setIsOpenModificationModal(true);

    return Promise.resolve();
  };

  const handleConfirmBooking = async (booking: Booking): Promise<any> => {
    if (!signer || !airBlockContract) return Promise.reject();

    let value: any;
    const property = properties[booking.propertyId.toNumber()];

    if (!property) return;

    const totalDayStays = booking.checkOutDay
      .sub(booking.checkInDay)
      .toNumber();

    if (property.currency === "ETH") {
      value = Number(ethers.utils.formatEther(property.price)) * totalDayStays;
    } else {
      value = property.price.toNumber() * totalDayStays;
    }

    return airBlockContract.connect(signer).confirmBooking(booking.bookingId, {
      value: ethers.utils.parseEther(String(value)),
    });
  };

  return (
    <Box
      borderWidth={1}
      borderColor="gray.650"
      borderRadius="lg"
      mx="5%"
      className="px-2 sm:px-4 lg:px-3"
    >
      {bookings.length === 0 ? <div>No reservations</div> : null}
      <BookingsList
        bookings={bookings}
        properties={properties}
        onClickModify={handleModifyBooking}
        onClickCancel={handleCancelBooking}
        onClickConfirm={handleConfirmBooking}
      />
      <ConfirmCancelBookingModal
        property={
          selectedBooking && properties[selectedBooking?.propertyId.toNumber()]
        }
        booking={selectedBooking}
        isOpen={isOpenCancellationModal}
        onClose={() => setIsOpenCancellationModal(false)}
        onOpen={() => setIsOpenCancellationModal(true)}
      />
      <ConfirmModifyBookingModal
        property={
          selectedBooking && properties[selectedBooking?.propertyId.toNumber()]
        }
        booking={selectedBooking}
        isOpen={isOpenModificationModal}
        onClose={() => setIsOpenModificationModal(false)}
        onOpen={() => setIsOpenModificationModal(true)}
      />
    </Box>
  );
};
