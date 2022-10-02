import { useState } from "react";
import { customHttpProvider } from "../../config";
import { Framework } from "@superfluid-finance/sdk-core";
import { Form, FormGroup } from "react-bootstrap";

import { ethers } from "ethers";
import { Text, Box, Button, Input } from "@chakra-ui/react";

//where the Superfluid logic takes place
async function createNewFlow(recipient, flowRate) {
  const sf = await Framework.create({
    chainId: 5,
    provider: customHttpProvider,
  });

  const signer = sf.createSigner({
    privateKey: "",
    provider: customHttpProvider,
  });

  const DAIxContract = await sf.loadSuperToken("fDAIx");
  const DAIx = DAIxContract.address;

  try {
    const createFlowOperation = sf.cfaV1.createFlow({
      flowRate: flowRate,
      receiver: recipient,
      superToken: DAIx,
      // userData?: string
    });

    console.log("Creating your stream...");

    const result = await createFlowOperation.exec(signer);
    console.log(result);

    console.log(
      `Congrats - you've just created a money stream!
    View Your Stream At: https://app.superfluid.finance/dashboard/${recipient}
    Network: Goerli
    Super Token: DAIx
    Sender: 0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721
    Receiver: ${recipient},
    FlowRate: ${flowRate}
    `
    );
  } catch (error) {
    console.log(
      "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
    );
    console.error(error);
  }
}

export const CreateFlow = () => {
  const [recipient, setRecipient] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [flowRate, setFlowRate] = useState("");
  const [flowRateDisplay, setFlowRateDisplay] = useState("");

  function calculateFlowRate(amount) {
    if (typeof Number(amount) !== "number" || isNaN(Number(amount)) === true) {
      alert("You can only calculate a flowRate based on a number");
      return;
    } else if (typeof Number(amount) === "number") {
      if (Number(amount) === 0) {
        return 0;
      }
      const amountInWei = ethers.BigNumber.from(amount);
      const monthlyAmount = ethers.utils.formatEther(amountInWei.toString());
      const calculatedFlowRate = monthlyAmount * 3600 * 24 * 30;
      return calculatedFlowRate;
    }
  }

  // function CreateButton({ isLoading, children, ...props }) {
  //   return (
  //     <Button variant="success" className="button" {...props}>
  //       {isButtonLoading ? <Spinner animation="border" /> : children}
  //     </Button>
  //   );
  // }

  const handleRecipientChange = (e) => {
    setRecipient(() => ([e.target.name] = e.target.value));
  };

  const handleFlowRateChange = (e) => {
    setFlowRate(() => ([e.target.name] = e.target.value));
    // if (typeof Number(flowRate) === "number") {
    let newFlowRateDisplay = calculateFlowRate(e.target.value);
    setFlowRateDisplay(newFlowRateDisplay.toString());
    // setFlowRateDisplay(() => calculateFlowRate(e.target.value));
    // }
  };

  return (
    <Box
      minWidth="350"
      height="300"
      bg="white"
      _dark={{ bg: "gray.900" }}
      borderWidth="xl"
      rounded="lg"
      shadow="lg"
      justifyContent="center"
    >
      <Text textAlign="center" textTransform="uppercase" pb="6" pt="2">
        Create a Flow with Superfluid
      </Text>
      <Form>
        <FormGroup className="mb-3" width="300px">
          <Input
            ml="5"
            maxWidth="300"
            name="recipient"
            value={recipient}
            onChange={handleRecipientChange}
            placeholder="Enter Owner's Ethereum address"
          ></Input>
        </FormGroup>
        <FormGroup className="mb-3">
          <Input
            ml="5"
            maxWidth="300"
            name="flowRate"
            value={flowRate}
            onChange={handleFlowRateChange}
            placeholder="Enter a flowRate in wei/second"
          ></Input>
        </FormGroup>
        <Button
          mt="2"
          mx="30%"
          colorScheme="teal"
          variant="outline"
          fontSize={{ base: "ms", md: "md" }}
          cursor="pointer"
          textAlign="center"
          borderColor="teal"
          borderRadius="2xl"
          maxW="100%"
          onClick={() => {
            setIsButtonLoading(true);
            createNewFlow(recipient, flowRate);
            setTimeout(() => {
              setIsButtonLoading(false);
            }, 1000);
          }}
        >
          Create Stream
        </Button>
      </Form>

      <Box textAlign="center" mt="4">
        <Text>Your flow will be equal to:</Text>
        <Text>
          <b>${flowRateDisplay !== " " ? flowRateDisplay : 0}</b> DAIx/per Day
          stayed
        </Text>
      </Box>
    </Box>
  );
};
