import { Box, Text, Link, Select, Stack, Input } from "@chakra-ui/react";

import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useColorModeValue,
} from "@chakra-ui/react";
//import Link from "next/link";
import { SearchIcon } from "@chakra-ui/icons";

import DividerBox from "./Divider";
//import Navbar from "./Navbar";
import Hero from "./Hero";

const Home = () => {
  // const [checkIn, setCheckIn] = useState(new Date());
  // const [checkOut, setCheckOut] = useState(new Date());
  // const [destination, setDestination] = useState("New York");
  // const [guests, setGuests] = useState(2);

  // Color Mode
  const BodyBgColor = useColorModeValue("gray.200", "#F6E3C5");
  const InputColor = useColorModeValue("black", "black");

  return (
    <>
      {/* BACKGROUND SECTION */}

      {/* <Image
        position="absolute"
        top="0"
        width="100vw"
        height="100vh"
        background-size="cover"
        z-index="-999"
        alt="cover-image"
        src="/frontpagebg.png"
      /> */}
      {/* NAVIGATION SECTION */}

      {/* BOOKING SEARCH SECTION */}
      <Box width="100%" display="flex" justifyContent="center" mt="5%">
        <Stack
          spacing="auto"
          direction="row"
          width="900px"
          bgColor={BodyBgColor}
          height="100px"
          borderRadius="100px"
          display="flex"
          justifyContent="space-evenly"
          alignItems="center"
          padding="40px"
        >
          {/* lOCATION INPUT SECTION */}
          <Box color="black" fontSize="13" fontWeight="normal" width="160px">
            <Text fontWeight="bold" textAlign="center">
              Location
            </Text>
            <Select
              color={InputColor}
              fontSize={{ base: "ms", md: "md" }}
              cursor="pointer"
              textAlign="center"
              borderColor="gray.700"
              borderRadius="2xl"
              maxW={200}
              // defaultOptionIndex={0}
              //onChange={(data) => setDestination(data.label)}
            >
              <option id="ny" label="New York">
                New York
              </option>
              <option id="lon" label="London">
                London
              </option>
              <option id="db" label="Dubai">
                Dubai
              </option>
            </Select>
          </Box>

          <DividerBox />

          {/* DATES INPUT SECTION */}

          <Box
            color="black"
            mt="10px"
            fontSize="13"
            fontWeight="bold"
            width="160px"
          >
            <Text textAlign="center">Check In</Text>
            <Input
              color={InputColor}
              fontWeight="normal"
              fontSize={{ base: "ms", md: "md" }}
              cursor="pointer"
              textAlign="center"
              borderColor="gray.700"
              borderRadius="2xl"
              maxW={200}
              placeholder="Select Date and Time"
              size="md"
              type="date"
              id="CheckIn"
              //onChange={(event) => setCheckIn(event.date)}
            />
          </Box>

          <DividerBox />

          <Box
            color="black"
            mt="10px"
            fontSize="13"
            fontWeight="bold"
            width="160px"
          >
            <Text textAlign="center">Check Out</Text>
            <Input
              fontWeight="normal"
              color={InputColor}
              fontSize={{ base: "ms", md: "md" }}
              cursor="pointer"
              textAlign="center"
              borderColor="gray.700"
              borderRadius="2xl"
              maxW={200}
              placeholder="Select Date and Time"
              size="md"
              type="date"
              id="CheckOut"
              //onChange={(event) => setCheckOut(event.date)}
            />
          </Box>

          <DividerBox />

          {/* GUESTS INPUT SECTION */}
          <Box
            color="black"
            fontSize="13"
            fontWeight="bold"
            width="160px"
            mt="10px"
          >
            <Text textAlign="center">Guests</Text>
            <NumberInput
              fontWeight="normal"
              color={InputColor}
              fontSize={{ base: "ms", md: "md" }}
              cursor="pointer"
              textAlign="center"
              borderColor="gray.700"
              maxW={200}
              placeholder="Select Date and Time"
              size="md"
              value={2}
              name="AddGuests"
              //type="number"
              //onChange={(event) => setGuests(Number(event.target.value))}
            >
              <NumberInputField
                color={InputColor}
                borderRadius="2xl"
                textAlign="center"
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </Box>
          <Link
            href="PropertyExplorer"
            // state={{
            //   destination: destination,
            //   checkIn: checkIn,
            //   checkOut: checkOut,
            //   guests: guests,
            // }}
          >
            <SearchIcon
              color="blue.700"
              aria-label="Search database"
              boxSize="25"
              mx="5"
              my="5"
            />
          </Link>
        </Stack>
      </Box>
      {/* HERO LANDING HERE  */}
      <Hero />
      {/* <Hero setCheckOut={checkOut} /> */}
    </>
  );
};

export default Home;
