/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable no-shadow */
import { useState } from "react";
import { NFTStorage } from "nft.storage";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import Waste from "../../utils/Waste.json";
import { wastemarketplaceAddress } from "../../config";
import { Text, Box, Button, Input, Textarea, Select } from "@chakra-ui/react";

// eslint-disable-next-line max-len
const APIKEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDc4RjdEY0EyRWY2OUFCNjk2NTBGQUYyN2RkMjdFZGREMzAxNzNCMEIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MzkyNTI0NTc4NiwibmFtZSI6IjNCbmIifQ.zH2tffmZVrexJuG-wjgwAkqHnrr1QFdTL3eTjTXOoZw";

/** rewrite ipfs:// uri to dweb.link gateway URLs
function makeGatewayURL(ipfsURI) {
  return ipfsURI.replace(/^ipfs:\/\//, "https://dweb.link/ipfs/");
}
 */

const MintProfile = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState();
  const [imageView, setImageView] = useState();
  const [metaDataURL, setMetaDataURl] = useState();
  const [txURL, setTxURL] = useState();
  const [txStatus, setTxStatus] = useState();
  const [formInput, updateFormInput] = useState({
    name: "Experience",
    description: "",
    country: "",
  });

  const handleFileUpload = (event) => {
    console.log("file for upload selected...");
    setUploadedFile(event.target.files[0]);
    setTxStatus("");
    setImageView("");
    setMetaDataURl("");
    setTxURL("");
  };

  const uploadNFTContent = async (inputFile) => {
    const { name, description, country, weight, collectionPoint, price } =
      formInput;
    if (
      !name ||
      !description ||
      !country ||
      !weight ||
      !collectionPoint ||
      !inputFile
    )
      return;
    const nftStorage = new NFTStorage({ token: APIKEY });
    try {
      console.log("Trying to upload asset to ipfs");
      setTxStatus("Uploading Item to IPFS & Filecoin via NFT.storage.");
      const metaData = await nftStorage.store({
        name,
        description,
        image: inputFile,
        properties: {
          country,
          collectionPoint,
          weight,
          price,
        },
      });
      setMetaDataURl(metaData.url);
      console.log("metadata is: ", { metaData });
      return metaData;
    } catch (error) {
      setErrorMessage(
        "Could not save Waste to NFT.Storage - Aborted minting Waste."
      );
      console.log("Error Uploading Content", error);
    }
  };

  const sendTxToBlockchain = async (metadata) => {
    try {
      setTxStatus("Adding transaction to Polygon Mumbai Blockchain.");
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);

      const price = ethers.utils.parseUnits(formInput.price, "ether");
      const connectedContract = new ethers.Contract(
        wastemarketplaceAddress,
        Waste.abi,
        provider.getSigner()
      );
      console.log("Connected to contract", wastemarketplaceAddress);
      console.log("IPFS blockchain uri is ", metadata.url);

      const mintNFTTx = await connectedContract.createToken(
        metadata.url,
        price
      );
      console.log("Waste successfully created and sent to Blockchain");
      // await mintNFTTx.wait();
      return mintNFTTx;
    } catch (error) {
      setErrorMessage("Failed to send tx to Polygon Mumbai.");
      console.log(error);
    }
  };

  const previewNFT = (metaData, mintNFTTx) => {
    console.log("getIPFSGatewayURL2 two is ...");
    const imgViewString = getIPFSGatewayURL(metaData.data.image.pathname);
    console.log("image ipfs path is", imgViewString);
    setImageView(imgViewString);
    setMetaDataURl(getIPFSGatewayURL(metaData.url));
    setTxURL(`https://mumbai.polygonscan.com/tx/${mintNFTTx.hash}`);
    setTxStatus("Waste registration was successfully!");
    console.log("Preview details completed");
  };

  const mintNFTToken = async (e, uploadedFile) => {
    e.preventDefault();
    // 1. upload NFT content via NFT.storage
    const metaData = await uploadNFTContent(uploadedFile);

    // 2. Mint a NFT token on Polygon
    const mintNFTTx = await sendTxToBlockchain(metaData);

    // 3. preview the minted nft
    previewNFT(metaData, mintNFTTx);

    navigate("/explore");
  };

  const getIPFSGatewayURL = (ipfsURL) => {
    const urlArray = ipfsURL.split("/");
    const ipfsGateWayURL = `https://${urlArray[2]}.ipfs.nftstorage.link/${urlArray[3]}`;
    return ipfsGateWayURL;
  };

  return (
    <>
      <Box
        bg="white"
        _dark={{ bg: "gray.900" }}
        width="max-content"
        borderRadius="lg"
        rounded="lg"
        shadow="lg"
        px="5"
        py="5"
      >
        <Text textTransform="uppercase" pb="1" pt="1" textAlign="center">
          Mint Your Experience
        </Text>
        <Box width="max-content">
          <Select
            textAlign="center"
            onChange={(e) =>
              updateFormInput({ ...formInput, name: e.target.value })
            }
          >
            <option value="Select Experience">Select Experience</option>
            <option value="Travel with family">Travel with family</option>
            <option value="Travel with friends">Travel with friends</option>
            <option value="The group tour">The group tour</option>
            <option value="The package trip">The package trip</option>
            <option value="The weekend break">The weekend break</option>
            <option value="Multi-day tour or cruise">
              Multi-day tour or cruise
            </option>
            <option value="Backpacking">Backpacking</option>
            <option value="Travel for an event">Travel for an event</option>
            <option value="Treat for to some luxury">
              Treat for to some luxury
            </option>
            <option value="A once-in-a-lifetime adventure">
              A once-in-a-lifetime adventure
            </option>
          </Select>
          <Textarea
            placeholder="Share your Experience"
            onChange={(e) =>
              updateFormInput({ ...formInput, description: e.target.value })
            }
            rows={2}
          />
          <Input
            placeholder="Location"
            onChange={(e) =>
              updateFormInput({ ...formInput, country: e.target.value })
            }
          />
          <input
            placeholder="Enter Address of Collecetion Point"
            className="mt-5 border rounded p-4 text-xl"
            onChange={(e) =>
              updateFormInput({ ...formInput, collectionPoint: e.target.value })
            }
          />

          <Box>
            <form>
              <Input type="file" onChange={handleFileUpload} />
            </form>
            {txStatus && <Text>{txStatus}</Text>}

            {metaDataURL && (
              <Text className="text-blue">
                <a href={metaDataURL} className="text-blue">
                  Metadata on IPFS
                </a>
              </Text>
            )}

            {txURL && (
              <Text>
                <a href={txURL} className="text-blue">
                  mint transaction
                </a>
              </Text>
            )}

            {errorMessage}

            {imageView && (
              <iframe
                className="mb-10"
                title="Ebook "
                src={imageView}
                alt="NFT preview"
                frameBorder="0"
                scrolling="auto"
                height="50%"
                width="100%"
              />
            )}
          </Box>

          <Button
            mt="2"
            color="#ff0057"
            variant="outline"
            fontSize={{ base: "ms", md: "md" }}
            cursor="pointer"
            textAlign="center"
            borderColor="#ff0057"
            borderRadius="2xl"
            maxW="100%"
            onClick={(e) => mintNFTToken(e, uploadedFile)}
          >
            Mint Your Experience
          </Button>
        </Box>
      </Box>
    </>
  );
};
export default MintProfile;

// <div className="text-4xl text-center text-white font-bold mt-10">
//   <h1> Register a waste</h1>
// </div>
// <div className="flex justify-center">
//   <div className="w-1/2 flex flex-col pb-12 ">
//     <select
//       className="mt-5 border rounded p-4 text-xl"
//       // value={this.state.value}
//       onChange={(e) =>
//         updateFormInput({ ...formInput, name: e.target.value })
//       }
//     >
//       <option value="Select Experience">Select Experience</option>
//       <option value="Travel with family">Travel with family</option>
//       <option value="Travel with friends">Travel with friends</option>
//       <option value="The group tour">The group tour</option>
//       <option value="The package trip">The package trip</option>
//       <option value="The weekend break">The weekend break</option>
//       <option value="Multi-day tour or cruise">
//         Multi-day tour or cruise
//       </option>
//       <option value="Backpacking">Backpacking</option>
//       <option value="Travel for an event">Travel for an event</option>
//       <option value="Treat for to some luxury">
//         Treat for to some luxury
//       </option>
//       <option value="A once-in-a-lifetime adventure"></option>
//     </select>
//     <textarea
//       placeholder="Description of waste"
//       className="mt-5 border rounded p-4 text-xl"
//       onChange={(e) =>
//         updateFormInput({ ...formInput, description: e.target.value })
//       }
//       rows={2}
//     />
//     <input
//       placeholder="Enter your Country / Region"
//       className="mt-5 border rounded p-4 text-xl"
//       onChange={(e) =>
//         updateFormInput({ ...formInput, country: e.target.value })
//       }
//     />
//     <input
//       placeholder="Enter Address of Collecetion Point"
//       className="mt-5 border rounded p-4 text-xl"
//       onChange={(e) =>
//         updateFormInput({ ...formInput, collectionPoint: e.target.value })
//       }
//     />
//     <input
//       placeholder="Weight in Kg"
//       className="mt-5 border rounded p-4 text-xl"
//       onChange={(e) =>
//         updateFormInput({ ...formInput, weight: e.target.value })
//       }
//     />
//     <input
//       placeholder="Price in Matic, if free put 0"
//       className="mt-5 border rounded p-4 text-xl"
//       onChange={(e) =>
//         updateFormInput({ ...formInput, price: e.target.value })
//       }
//     />
//     <br />

//     <div className="MintNFT text-white text-xl">
//       <form>
//         <h3>Select a picture of the waste</h3>
//         <input
//           type="file"
//           onChange={handleFileUpload}
//           className="mt-5 border rounded p-4 text-xl"
//         />
//       </form>
//       {txStatus && <p>{txStatus}</p>}
//       <br />
//       {metaDataURL && (
//         <p className="text-blue">
//           <a href={metaDataURL} className="text-blue">
//             Metadata on IPFS
//           </a>
//         </p>
//       )}
//       <br />
//       {txURL && (
//         <p>
//           <a href={txURL} className="text-blue">
//             See the mint transaction
//           </a>
//         </p>
//       )}
//       <br />
//       {errorMessage}

//       <br />
//       {imageView && (
//         <iframe
//           className="mb-10"
//           title="Ebook "
//           src={imageView}
//           alt="NFT preview"
//           frameBorder="0"
//           scrolling="auto"
//           height="50%"
//           width="100%"
//         />
//       )}
//     </div>

//     <button
//       type="button"
//       onClick={(e) => mintNFTToken(e, uploadedFile)}
//       className="font-bold mt-20 bg-green-500 text-white text-2xl rounded p-4 shadow-lg"
//     >
//       Register Item
//     </button>
//   </div>
// </div>
