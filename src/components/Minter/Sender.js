/* eslint-disable no-use-before-define */

import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";

import Waste from "../../utils/Waste.json";
import { wastemarketplaceAddress } from "../../config";

import { Box, Text, Image, SimpleGrid, Flex } from "@chakra-ui/react";

export default function Sender() {
  //  const navigate = useNavigate();
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    // eslint-disable-next-line no-use-before-define
    loadWaste();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getIPFSGatewayURL = (ipfsURL) => {
    const urlArray = ipfsURL.split("/");
    const ipfsGateWayURL = `https://${urlArray[2]}.ipfs.nftstorage.link/${urlArray[3]}`;
    return ipfsGateWayURL;
  };

  // const rpcUrl = "https://matic-mumbai.chainstacklabs.com";
  // const rpcUrl = "http://localhost:8545";

  async function loadWaste() {
    /* create a generic provider and query for Wastes */
    const provider = new ethers.providers.JsonRpcProvider(
      "https://matic-mumbai.chainstacklabs.com"
    );
    const contract = new ethers.Contract(
      wastemarketplaceAddress,
      Waste.abi,
      provider
    );
    const data = await contract.fetchMarketItems();
    console.log("Waste data fetched from contract", data);
    /*
     *  map over items returned from smart contract and format
     *  them as well as fetch their token metadata
     */
    // eslint-disable-next-line arrow-parens
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await contract.tokenURI(i.tokenId);
        console.log("token Uri is ", tokenUri);
        const httpUri = getIPFSGatewayURL(tokenUri);
        console.log("Http Uri is ", httpUri);
        const meta = await axios.get(httpUri);
        const price = ethers.utils.formatUnits(i.price.toString(), "ether");

        const item = {
          price,
          tokenId: i.tokenId.toNumber(),
          image: getIPFSGatewayURL(meta.data.image),
          name: meta.data.name,
          description: meta.data.description,
          country: meta.data.properties.country,
          collectionPoint: meta.data.properties.collectionPoint,
          weight: meta.data.properties.weight,
        };
        console.log("item returned is ", item);
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }
  // eslint-disable-next-line no-unused-vars
  async function recycle(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    console.log("item id clicked is", nft.tokenId);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      wastemarketplaceAddress,
      Waste.abi,
      signer
    );

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price,
    });
    await transaction.wait();
    console.log("waste transaction completed, waste should show in UI ");
    const token = nft.tokenId;
    console.log("token id is ", token);
    loadWaste();
    // navigate("/view", { state: token });
  }
  if (loadingState === "loaded" && !nfts.length) {
    return (
      <div>
        <h1 className="px-20 py-10 text-3xl">No Entries yet</h1>
      </div>
    );
  }
  return (
    <>
      <Text mb={1} pl={2} ml={5} fontSize="3xl" fontWeight="Semibold">
        Our Traveling Experiences{" "}
      </Text>
      <SimpleGrid columns={[1, null, 4]} spacingX={4} spacingY={4}>
        {nfts.map((nft, i) => (
          <Flex
            p={30}
            alignItems="center"
            justifyContent="space-between"
            key={i}
          >
            <Box
              width="100%"
              minWidth="300"
              height="440"
              bg="white"
              _dark={{ bg: "gray.900" }}
              borderWidth="xl"
              rounded="lg"
              shadow="lg"
            >
              <Image
                roundedTop="lg"
                roundedBottom="lg"
                height="320"
                minWidth="300"
                width="100%"
                mb={2}
                src={`${nft.image}#toolbar=0`}
              />

              <Text
                mb={1}
                pl={2}
                fontSize="smaller"
                fontWeight="normal"
                mx="auto"
              >
                {nft.name}
              </Text>
              <Text
                mb={1}
                pl={2}
                fontSize="smaller"
                fontWeight="normal"
                mx="auto"
              >
                {nft.description}
              </Text>
              <Text
                mb={1}
                pl={2}
                fontSize="smaller"
                fontWeight="normal"
                mx="auto"
              >
                {nft.country}
              </Text>

              {/* <Button
              colorScheme="teal"
              variant="outline"
              cursor="pointer"
              textAlign="center"
              borderColor="teal"
              borderRadius="2xl"
              width={200}
              mx="10"
              mt="0.5%"
              onClick={() => recycle(nft)}
            >
              Share
            </Button> */}
            </Box>
          </Flex>
        ))}
      </SimpleGrid>
    </>
  );
}
