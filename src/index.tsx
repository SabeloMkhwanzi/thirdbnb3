import { Web3ReactProvider } from "@web3-react/core";
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import "./index.css";
import "tw-elements";
import { getProvider } from "./utils/provider";
// 1. import `ChakraProvider` component
import { ChakraProvider } from "@chakra-ui/react";

// wagmi implementation

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getProvider}>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
