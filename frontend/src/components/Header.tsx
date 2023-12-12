import { FC } from "react";
import { Link } from "react-router-dom";

const Header: FC = () => {
  return (
    <header className="bg-blue-100 p-2 flex justify-between">
      <div className="flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/my">My</Link>
        <Link to="/sale">Sale</Link>
      </div>
      <div>Metamask Login</div>
    </header>
  );
};

export default Header;
