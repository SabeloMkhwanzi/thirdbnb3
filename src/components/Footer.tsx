import {
  Box,
  Container,
  Stack,
  Text,
  //useColorModeValue,
} from "@chakra-ui/react";

export default function Footer() {
  //const backgroundColor = useColorModeValue("#1CD6CE", "#243036");
  //const TextColorMode = useColorModeValue("gray.500", "gray.400");

  return (
    <Box>
      <Container
        as={Stack}
        maxW={"6xl"}
        maxheight="2"
        py={4}
        direction={{ base: "column", md: "row" }}
        spacing={4}
        justify={{ base: "center", md: "space-between" }}
        align={{ base: "center", md: "center" }}
      >
        <Text
          mx="auto"
          textTransform="uppercase"
          fontWeight="normal"
          fontSize={{ base: "xs", md: "sm", lg: "md" }}
          as="kbd"
          letterSpacing={2}
        >
          EthGlobal EthOnline © 2022 thirdbnb made with ♥ and Possible with Web3
          Technologies & Blockchain
        </Text>
      </Container>
    </Box>
  );
}
