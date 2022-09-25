export const Framework = require("@superfluid-finance/sdk-core");
export const ethers = require("ethers");

// Ethers.js provider initialization
export const url =
  "https://eth-goerli.alchemyapi.io/v2/7W_O4i_wsGf5hF6myoVM7Flx3Q_f0Rqa";
export const customHttpProvider = new ethers.providers.JsonRpcProvider(url);

// Contract address old
// export const wastemarketplaceAddress = "0x1Be8c447137313a8d810E9931F01523fDD0FbC35";

// Contract address new
export const wastemarketplaceAddress =
  "0xF8a9ed3Fe003911904d8b0bB6a00026149BDb28C";
