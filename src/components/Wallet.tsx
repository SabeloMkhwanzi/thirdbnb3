import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import {
  NoEthereumProviderError,
  UserRejectedRequestError
} from '@web3-react/injected-connector';
import { useEagerConnect, useInactiveListener } from '../utils/hooks';
import { Provider } from '../utils/provider';
import { WalletStatus } from './WalletStatus';
import { ConnectWalletButton } from './ConnectWalletButton';

function getErrorMessage(error: Error): string {
  let errorMessage: string;

  switch (error.constructor) {
    case NoEthereumProviderError:
      errorMessage = `No Ethereum browser extension detected. Please install MetaMask extension.`;
      break;
    case UnsupportedChainIdError:
      errorMessage = `You're connected to an unsupported network.`;
      break;
    case UserRejectedRequestError:
      errorMessage = `Please authorize this website to access your Ethereum account.`;
      break;
    default:
      errorMessage = error.message;
  }

  return errorMessage;
}

export const Wallet = () => {
  const context = useWeb3React<Provider>();
  const { active } = context;

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has
  // granted access already
  const eagerConnectionSuccessful = useEagerConnect();
  // handle logic to connect in reaction to certain events on the injected ethereum provider,
  // if it exists
  useInactiveListener(!eagerConnectionSuccessful);

  const { error } = context;

  return (
    <div className="px-2 sm:px-6 lg:px-8">
      {!active ? (
        <ConnectWalletButton />
      ) : null}
      {error ? <div>{getErrorMessage(error)}</div> : null}
      {active ? <WalletStatus /> : null}
    </div>
  );
};
