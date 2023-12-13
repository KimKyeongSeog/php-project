import { SetStateAction, Dispatch, FC, useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { NftMetadata, OutletContext } from "../types";

interface MintModalProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const MintModal: FC<MintModalProps> = ({ setIsOpen }) => {
  const [metadata, setMetadata] = useState<NftMetadata>();

  const { mintNftContract, account } = useOutletContext<OutletContext>();

  const onClickMint = async () => {
    try {
      if (!mintNftContract || !account) return;

      await mintNftContract.methods.mintNFT().send({ from: account });

      const balance = await mintNftContract.methods
        // @ts-expect-error
        .balanceOf(account)
        .call();

      const tokenId = await mintNftContract.methods
        // @ts-expect-error
        .tokenOfOwnerByIndex(account, Number(balance) - 1)
        .call();

      const metadataURI: string = await mintNftContract.methods
        // @ts-expect-error
        .tokenURI(Number(tokenId))
        .call();

      const response = await axios.get(metadataURI);

      setMetadata(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-50 flex justify-center items-center">
      <div className="p-8 bg-white rounded-xl">
        {metadata ? (
          <div className="w-60">
            <img
              className="w-60 h-60"
              src={metadata.image}
              alt={metadata.name}
            />
            <div className="font-semibold mt-1">{metadata.name}</div>
            <div className="mt-1">{metadata.description}</div>
            <ul className="mt-1 flex items-center flex-wrap gap-1">
              {metadata.attributes.map((v, i) => (
                <li key={i}>
                  <span className="font-semibold">{v.trait_type}</span>
                  <span> : {v.value}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div>NFT를 민팅하시겠습니까?</div>
            <div className="border-orange-500 border-4 rounded-2xl text-center mt-4 w-16 ">
              <button onClick={onClickMint}>Agree</button>
            </div>
          </div>
        )}
        <div className="border-orange-500 border-4 rounded-2xl text-center mt-4 w-16 hover:text-gray-500 mx-auto">
          <button onClick={() => setIsOpen(false)}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default MintModal;
