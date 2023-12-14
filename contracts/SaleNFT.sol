// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import './MintNFT.sol';

contract SaleNFT {
    // tokenId => price mapping( 키 타입 => 값 타입)
    mapping(uint => uint) public nftPrices; 

    uint[] public onSaleNFTs;

    function setForSaleNFT(address _mintNftAddress, uint _tokenId, uint _price) public {
        ERC721 mintNftContract = ERC721(_mintNftAddress); // 선언해야 _mintNftAddress 사용가능
      address nftOwner = mintNftContract.ownerOf(_tokenId);

        require(msg.sender == nftOwner, "Caller is Not NFT owner.");
        require(_price > 0, "Price is zero or lower.");
        require(nftPrices[_tokenId] == 0, "This NFT is alreadt on sale");
        require(mintNftContract.isApprovedForAll(msg.sender, address(this)), "NFT owner did not approve token.");


      nftPrices[_tokenId] = _price;

        onSaleNFTs.push(_tokenId);
    //판매의 목적이므로, MintNFT 내의 기능을 굳이 가져올 필요 없이 ERC721를 직접 상속하였다. MintNFT를 상속하는 경우 세부적인 조정이 필요하기도 하다.
    //setApprovalForAll 상대방에게 나의 권한을 넘김 setApprovalForAll 배포의 권한이 있는지 확인하는 것
    }


    //컨트랙트 주소, 토큰ID, 가격, 구매자 => 구매 //payable 이더리움을 주고 받을 때 사용함
    function purchaseNFT(address _mintNftAddress, uint _tokenId) public payable {
        ERC721 mintNftContract = ERC721(_mintNftAddress);
        address nftOwner = mintNftContract.ownerOf(_tokenId);

        require(msg.sender != nftOwner, "Caller is NFT owner");
        require(nftPrices[_tokenId] > 0, "This NFT not sale");
        require(nftPrices[_tokenId] <= msg.value, "Caller sent lower than price");

        payable(nftOwner).transfer(msg.value); 

        mintNftContract.safeTransferFrom(nftOwner, msg.sender, _tokenId);

        nftPrices[_tokenId] = 0;
    // 판매된 NFT LIST에서 제거 pop, array.length-1 mapping / array
        checkZeroPrice();

    }

    function checkZeroPrice() public {
        for(uint i = 0; i < onSaleNFTs.length; i++) {
            if(nftPrices[onSaleNFTs[i]] == 0) {
                onSaleNFTs[i] = onSaleNFTs[onSaleNFTs.length -1];
                onSaleNFTs.pop();
            }
        }
    }

    function getOnSaleNFTs() public view returns(uint[] memory) {
        return onSaleNFTs;
    }
}