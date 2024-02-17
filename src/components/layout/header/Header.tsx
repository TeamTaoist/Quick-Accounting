import Navbar from "../navbar/Navbar";
import { VersionAtRight } from "../../version";

const Header = ({ children, ...props }: { children: React.ReactNode }) => {
  return (
    <div {...props}>
      <Navbar />
      <div className="container">{children}</div>
      <VersionAtRight />
    </div>
  );
};

export default Header;
