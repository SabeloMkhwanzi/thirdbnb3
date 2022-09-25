import {
  Box,
  Flex,
  HStack,
  Link,
  useDisclosure,
  Stack,
  IconButton,
  Button,
  Image,
  Text,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";

// Import from React
//import { useState } from "react";
import { useWeb3React } from "@web3-react/core";
//import { Disclosure } from "@headlessui/react";
//import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { Provider } from "../utils/provider";
//import { Link } from "react-router-dom";

import logo from "../logos/thirdbnb-1.png";
import { DeployContractButton } from "./DeployContractButton";
import { ConnectWalletButton } from "./ConnectWalletButton";

//Components Imports
import ConnectUNSD from "./ConnectUNSD";
import { ColorMode } from "./ColorMode";
import { useColorModeValue } from "@chakra-ui/react";
import EspnNotification from "./EspnNotification";

// const navigation = [
//   { name: "Home", current: true, to: "/", key: 0 },
//   { name: "Reservations", current: false, to: "/reservations", key: 1 },
//   { name: "Your listings", current: false, to: "/listings", key: 2 },
//   { name: "Wallet", current: false, to: "/wallet", key: 3 },
// ];

// function classNames(...classes: any) {
//   return classes.filter(Boolean).join(" ");
// }

export const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const BodyBgColor = useColorModeValue("white", "gray.800");
  const TextColor = useColorModeValue("black", "white");

  //  const [currentTab, setCurrentTab] = useState(window.location.pathname);
  const context = useWeb3React<Provider>();
  const { active } = context;

  return (
    <>
      <Box
        bg={BodyBgColor}
        justify-content="space-between"
        alignItems="center"
        width="93%"
        padding="30px 60px"
      >
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            color="purple.600"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />

          <Image
            src={logo}
            alt="thirdbnb"
            width="12vw"
            height="calc(17vw*0.3)"
          />

          <HStack spacing={5} alignItems={"center"}>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              <Stack
                direction={"row"}
                spacing={5}
                justify={"center"}
                align={"center"}
              >
                <Button borderRadius="2xl">
                  <Link
                    py={3}
                    fontSize="md"
                    fontFamily="monospace"
                    textTransform="uppercase"
                    fontWeight="semibold"
                    letterSpacing={1}
                    color="white"
                    href={"/"}
                  >
                    <Text textColor={TextColor}>Home</Text>
                  </Link>
                </Button>
                <Button borderRadius="2xl">
                  <Link
                    py={3}
                    fontSize="md"
                    fontFamily="monospace"
                    textTransform="uppercase"
                    fontWeight="semibold"
                    letterSpacing={1}
                    color="white"
                    href={"PropertyExplorer"}
                  >
                    <Text textColor={TextColor}>Explore</Text>
                  </Link>
                </Button>
                <Button borderRadius="2xl">
                  <Link
                    py={3}
                    fontSize="md"
                    fontFamily="monospace"
                    textTransform="uppercase"
                    fontWeight="semibold"
                    letterSpacing={1.5}
                    color="white"
                    href={"/reservations"}
                  >
                    <Text textColor={TextColor}>Reservations</Text>
                  </Link>
                </Button>
                <Button borderRadius="2xl">
                  <Link
                    py={3}
                    fontSize="md"
                    fontFamily="monospace"
                    textTransform="uppercase"
                    fontWeight="semibold"
                    letterSpacing={1}
                    href={"/listings"}
                    color="white"
                  >
                    <Text textColor={TextColor}>Become a Host</Text>
                  </Link>
                </Button>
                <Button borderRadius="2xl">
                  <Link
                    py={3}
                    fontSize="md"
                    fontFamily="monospace"
                    textTransform="uppercase"
                    fontWeight="semibold"
                    letterSpacing={1}
                    href={"/Sender"}
                    color="white"
                  >
                    <Text textColor={TextColor}>Experiences</Text>
                  </Link>
                </Button>
              </Stack>
            </HStack>
          </HStack>

          <Flex alignItems="center">
            <EspnNotification />
            {active ? (
              <DeployContractButton />
            ) : (
              <>
                <ConnectWalletButton />
                <ConnectUNSD />
              </>
            )}

            <ColorMode />
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              <Link
                px={2}
                py={1}
                fontSize="md"
                textTransform="uppercase"
                fontWeight="normal"
                letterSpacing={2}
                color="white"
                href="/"
              >
                Home
              </Link>
              <Link
                px={2}
                py={1}
                fontSize="md"
                textTransform="uppercase"
                fontWeight="normal"
                letterSpacing={2}
                color="white"
                href={"sell"}
              >
                Explore
              </Link>
              <Link
                px={2}
                py={1}
                fontSize="md"
                textTransform="uppercase"
                fontWeight="normal"
                letterSpacing={2}
                color="white"
                href={"sell"}
              >
                Reservations
              </Link>
              <Link
                px={2}
                py={1}
                fontSize="md"
                textTransform="uppercase"
                fontWeight="normal"
                letterSpacing={2}
                color="white"
                href={"sell"}
              >
                Become a Host
              </Link>
              <Link
                px={2}
                py={1}
                fontSize="md"
                textTransform="uppercase"
                fontWeight="normal"
                letterSpacing={2}
                color="white"
                href={"sell"}
              >
                Experiences
              </Link>
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
};

//"0xAA9Ac42735D31762027DA6936e8166ED729401eD";
