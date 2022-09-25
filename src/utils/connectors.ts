import { InjectedConnector } from "@web3-react/injected-connector";

export const injected = new InjectedConnector({
  supportedChainIds: [
    80001, 1, 3, 4, 5, 42, 31337, 1313161555, 10, 420, 69, 43114, 137, 56,
  ],
});
