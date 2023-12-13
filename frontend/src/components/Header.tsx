import { useSDK } from "@metamask/sdk-react";
import { Dispatch, FC, SetStateAction } from "react";
import { Link } from "react-router-dom";

interface HeaderProps {
  account: string;
  setAccount: Dispatch<SetStateAction<string>>;
}
//프롭스를 받은 컴포넌트에 작성, 인터페이스를 통해 객체를 지정
const Header: FC<HeaderProps> = ({ account, setAccount }) => {
  const { sdk } = useSDK();

  const onClickMetaMask = async () => {
    try {
      const accounts: any = await sdk?.connect();

      setAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="p-2 flex justify-between">
      <div className="flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/my">My</Link>
        <Link to="/sale">Sale</Link>
      </div>
      <div>
        {account ? (
          <div>
            <span>
              {account.substring(0, 7)}...
              {account.substring(account.length - 5)}
            </span>
            <button className="ml-4" onClick={() => setAccount("")}>
              Logout
            </button>
          </div>
        ) : (
          <button onClick={onClickMetaMask}>MetaMask Login</button>
        )}
      </div>
    </header>
  );
};

export default Header;

{
  /* <button onClick={onClickMetamask}>Metamask Login</button> */
}
