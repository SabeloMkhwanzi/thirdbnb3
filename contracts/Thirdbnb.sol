//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Thirdbnb {
  struct Property {
    uint256 id;
    string name;
    string description;
    string location;
    string[] images; 
    bool isActive;
    uint256 price;
    string currency;
    address owner;
    bool[] isBooked;
  }

  struct Booking {
    uint256 bookingId;
    uint256 propertyId;
    string checkInDate;
    string checkOutDate;
    uint256 checkInDay;
    uint256 checkOutDay;
    uint256 totalPrice;
    bool isConfirmed;
    bool isDeleted;
    address renter;
  }

  mapping(uint256 => Property) public properties;
  mapping(uint256 => Booking) public bookings;

  uint256 public bookingId;
  uint256 public propertyId;

  // emitted when a new property is put up for sale or rent
  event NewProperty(uint256 indexed propertyId);

  // emitted when a new booking is made
  event NewBooking(uint256 indexed propertyId, uint256 indexed bookingId);

  // emitted when a booking is confirmed
  event ConfirmBooking(uint256 indexed bookingId);

  // emitted when a booking is cancelled
  event CancelBooking(uint256 indexed bookingId);

  // emitted when a booking is modified
  event ModifyBooking(uint256 indexed bookingId);

  function listProperty(
    string memory name,
    string memory description,
    string memory location,
    string[] memory images,
    uint256 price,
    string memory currency
  ) public returns (uint256) {
    uint256 currPropertyId = propertyId;
    Property memory newProperty = Property(
      currPropertyId,
      name,
      description,
      location,
      images,
      true, /* isActive */
      price,
      currency,
      msg.sender, /* owner */
      new bool[](365)
    );

    properties[currPropertyId] = newProperty;
    emit NewProperty(propertyId++);

    return currPropertyId;
  }

  function getAllProperties() public view returns (Property[] memory) {
    Property[] memory allProperties = new Property[](propertyId);

    for (uint256 i = 0; i < propertyId; i++) {
      allProperties[i] = properties[i];
    }

    return allProperties;
  }

  function getAllActiveProperties() public view returns (Property[] memory) {
    Property[] memory allActiveProperties = new Property[](propertyId);
    uint256 index = 0;

    for (uint256 i = 0; i < propertyId; i++) {
      if (properties[i].isActive == true) {
        allActiveProperties[index] = properties[i];
        index += 1;
      }
    }

    return allActiveProperties;
  }

  function getPropertiesForOwner() public view returns (Property[] memory) {
    Property[] memory propertiesForOwner = new Property[](propertyId);
    uint256 index = 0;

    for (uint256 i = 0; i < propertyId; i++) {
      if (properties[i].owner == msg.sender) {
        propertiesForOwner[index] = properties[i];
        index += 1;
      }
    }

    return propertiesForOwner;
  }

  function rentProperty(
    uint256 _propertyId,
    string memory checkInDate,
    string memory checkOutDate,
    uint256 checkInDay,
    uint256 checkOutDay
  ) public {
    Property storage property = properties[_propertyId];
    require(property.isActive == true, 'property with this ID is not active');

    for (uint256 i = checkInDay; i < checkOutDay; i++) {
      if (property.isBooked[i] == true) {
        revert('property is not available for the selected dates');
      }
    }

    uint256 totalPrice = property.price * (checkOutDay - checkInDay);

    createBooking(
      _propertyId,
      checkInDate,
      checkOutDate,
      checkInDay,
      checkOutDay,
      totalPrice,
      msg.sender
    );
  }

  function deleteBooking(uint256 _bookingId) public {
    Booking memory deletedBooking = bookings[_bookingId];
    Property memory currentProperty = properties[deletedBooking.propertyId];

    require(
      deletedBooking.isConfirmed == false,
      'booking has already been confirmed. Delete is not possible'
    );
    require(
      deletedBooking.renter == msg.sender,
      'not the person who originally made the booking'
    );

    for (
      uint256 i = deletedBooking.checkInDay;
      i < deletedBooking.checkOutDay;
      i++
    ) {
      currentProperty.isBooked[i] = false;
    }

    deletedBooking.isDeleted = true;
    bookings[_bookingId] = deletedBooking;

    emit CancelBooking(deletedBooking.bookingId);
  }

  function modifyBooking(
    uint256 _bookingId,
    string memory newCheckInDate,
    string memory newCheckOutDate,
    uint256 newCheckInDay,
    uint256 newCheckOutDay
  ) public {
    Booking memory newBooking = bookings[_bookingId];
    Property memory currentProperty = properties[newBooking.propertyId];

    require(
      currentProperty.isActive == true,
      'property with this ID is not active'
    );
    require(
      newBooking.isDeleted == false,
      'booking with this ID is already deleted'
    );
    require(
      newBooking.renter == msg.sender,
      'not the person who originally made the booking'
    );

    for (uint256 i = newCheckInDay; i < newCheckOutDay; i++) {
      if (currentProperty.isBooked[i] == true) {
        revert('property is not available for the selected dates');
      }
    }

    for (uint256 i = newBooking.checkInDay; i < newBooking.checkOutDay; i++) {
      currentProperty.isBooked[i] = false;
    }

    for (uint256 i = newCheckInDay; i < newCheckOutDay; i++) {
      currentProperty.isBooked[i] = true;
    }

    uint256 totalPrice = currentProperty.price *
      (newCheckOutDay - newCheckInDay);

    newBooking.totalPrice = totalPrice;
    newBooking.checkInDate = newCheckInDate;
    newBooking.checkOutDate = newCheckOutDate;

    bookings[_bookingId] = newBooking;

    emit ModifyBooking(newBooking.bookingId);
  }

  function confirmBooking(uint256 _bookingId) public payable {
    Booking memory currentBooking = bookings[_bookingId];
    Property memory currentProperty = properties[currentBooking.propertyId];
    require(
      currentBooking.isDeleted == false,
      'booking with this ID is already deleted'
    );
    require(
      currentProperty.isActive == true,
      'property with this ID is not active'
    );
    require(
      currentBooking.renter == msg.sender,
      'not the person who originally made the booking'
    );

    uint256 totalPrice = currentProperty.price *
      (currentBooking.checkOutDay - currentBooking.checkInDay);

    require(msg.value >= totalPrice, 'Sent insufficient funds');

    currentBooking.isConfirmed = true;
    bookings[_bookingId] = currentBooking;
    sendFunds(currentProperty.owner, currentBooking.totalPrice);

    emit ConfirmBooking(currentBooking.bookingId);
  }

  function getBookingsForTenant() public view returns (Booking[] memory) {
    Booking[] memory bookingsForTenant = new Booking[](bookingId);

    for (uint256 i = 0; i < bookingId; i++) {
      if (bookings[i].renter == msg.sender) {
        bookingsForTenant[i] = bookings[i];
      }
    }

    return bookingsForTenant;
  }

  function getAllBookings() public view returns (Booking[] memory) {
    Booking[] memory allBookings = new Booking[](bookingId);

    for (uint256 i = 0; i < bookingId; i++) {
      allBookings[i] = bookings[i];
    }

    return allBookings;
  }

  function createBooking(
    uint256 _propertyId,
    string memory checkInDate,
    string memory checkOutDate,
    uint256 checkInDay,
    uint256 checkOutDay,
    uint256 totalPrice,
    address renter
  ) internal {
    bookings[bookingId] = Booking(
      bookingId,
      _propertyId,
      checkInDate,
      checkOutDate,
      checkInDay,
      checkOutDay,
      totalPrice,
      false,
      false,
      renter
    );

    Property storage property = properties[_propertyId];

    for (uint256 i = checkInDay; i < checkOutDay; i++) {
      property.isBooked[i] = true;
    }

    emit NewBooking(_propertyId, bookingId++);
  }

  function sendFunds(address beneficiary, uint256 value) internal {
    payable(beneficiary).transfer(value);
  }

  function markPropertyAsInactive(uint256 _propertyId) public {
    require(
      properties[_propertyId].owner == msg.sender,
      'Not a propety owner and cannot mark property as inactive'
    );

    properties[_propertyId].isActive = false;
  }
}
