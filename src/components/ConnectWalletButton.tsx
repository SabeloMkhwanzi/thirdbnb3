import { MouseEvent } from "react";
import { useWeb3React } from "@web3-react/core";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { Provider } from "../utils/provider";
import { injected } from "../utils/connectors";
import { Button } from "@chakra-ui/react";

type ActivateFunction = (
  connector: AbstractConnector,
  onError?: (error: Error) => void,
  throwErrors?: boolean
) => Promise<void>;

export const ConnectWalletButton = () => {
  const context = useWeb3React<Provider>();
  const { activate } = context;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    async function _activate(activate: ActivateFunction): Promise<void> {
      await activate(injected);
    }

    _activate(activate);
  };

  return (
    <Button
      onClick={handleClick}
      colorScheme="teal"
      variant="outline"
      fontSize={{ base: "ms", md: "md" }}
      cursor="pointer"
      textAlign="center"
      borderColor="teal"
      borderRadius="2xl"
      maxW="100%"
    >
      Connect
    </Button>
  );
};
