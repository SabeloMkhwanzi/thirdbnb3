import { useState, useEffect, useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers, Signer } from 'ethers';
import { Provider } from '../utils/provider';
import { PropertyListReserve } from './PropertyListReserve';
import AirBlockArtifact from '../artifacts/contracts/AirBlock.sol/AirBlock.json';
import type { Property } from '../types';
import { contractAddress } from "./address";

export const PropertyExplorer = () => {
  const context = useWeb3React<Provider>();
  const { library } = context;
  const [signer, setSigner] = useState<Signer>();
  const [properties, setProperties] = useState<Property[]>([]);

  const airBlockContract = useMemo(() => {
    return new ethers.Contract(contractAddress, AirBlockArtifact.abi, signer);
  }, [signer]);

  useEffect((): void => {
    if (!library) {
      setSigner(undefined);
      return;
    }

    setSigner(library.getSigner());
  }, [library]);

  useEffect(() => {
    if (!signer) return;

    airBlockContract.connect(signer).getAllProperties().then(setProperties);

    airBlockContract.connect(signer).on('NewProperty', async (propertyId) => {
      airBlockContract.connect(signer).getAllProperties().then(setProperties);
    });
  }, [airBlockContract, signer]);

  return (
    <div className="px-2 sm:px-6 lg:px-8">
      <PropertyListReserve properties={properties} />
    </div>
  );
};
