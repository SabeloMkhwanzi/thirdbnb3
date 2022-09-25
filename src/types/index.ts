import { BigNumber } from 'ethers';

export type Property = {
  id: BigNumber;
  name: string;
  description: string;
  location: string;
  images: string[];
  price: BigNumber;
  currency: string;
  isActive: boolean;
  owner: string;
  isBooked: boolean[];
};

export type Booking = {
  bookingId: BigNumber;
  propertyId: BigNumber;
  checkInDay: BigNumber;
  checkOutDay: BigNumber;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: BigNumber;
  isConfirmed: boolean;
  isDeleted: boolean;
  user: string;
}