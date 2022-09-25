import {
  // Button,
  useColorModeValue,
  Heading,
  Stack,
  Text,
  //Link,
} from "@chakra-ui/react";

export default function Hero() {
  const BodyBgColor = useColorModeValue("white", "gray.800");
  const Texth1Color = useColorModeValue("black", "white");
  const TextH2Color = useColorModeValue("#ff0057", "#ff0057");
  const TextPcolor = useColorModeValue("black", "#F6E3C5");

  return (
    <>
      <Stack
        bg={BodyBgColor}
        mt="7vh"
        color="white"
        width="100%"
        pl="100px"
        direction={{ base: "column", md: "row" }}
        p={8}
        flex={1}
        align={"center"}
        justify={"center"}
      >
        <Stack
          spacing={6}
          w={"full"}
          maxW={"lg"}
          textAlign="center"
          alignContent="center"
        >
          <Heading fontSize={{ base: "m", md: "xl", lg: "xl" }}>
            <Text
              fontFamily="heading"
              as={"span"}
              position={"relative"}
              fontWeight="bold"
              color={Texth1Color}
              mr={4}
            >
              Feel Adventurous, Let`s discover,
            </Text>
            <br />
            <br />

            <Text
              fontWeight="bold"
              color={TextH2Color}
              fontFamily="heading"
              as={"span"}
            >
              let`s stay, let`s live. Let`s work or just relax!
            </Text>
          </Heading>
          <Text
            fontFamily="monospace"
            fontSize={{ base: "md", lg: "xl" }}
            color={TextPcolor}
          >
            A web3-based Airbnb contender. Decentralized DApp for the
            home-share, hosting and NFT user sharing there experiences. Using
            web3 Decentralized technology to Giving hosts and guests more
            control, ownership, and value over the Blockchain
          </Text>
          {/* <Stack direction={{ base: "column", md: "row" }} spacing={4} mx="50">
            <Button
              colorScheme="teal"
              variant="outline"
              fontSize={{ base: "ms", md: "md" }}
              cursor="pointer"
              textAlign="center"
              borderColor="teal"
              borderRadius="2xl"
              maxW={200}
            >
              <Link href="/reservations" />
              Lets Explore
            </Button>
            <Button
              colorScheme="teal"
              variant="outline"
              fontSize={{ base: "ms", md: "md" }}
              cursor="pointer"
              textAlign="center"
              borderColor="teal"
              borderRadius="2xl"
              maxW={200}
            >
              <Link href="/listings" />
              Lets Host
            </Button>
          </Stack> */}
        </Stack>
      </Stack>
    </>
  );
}
