import Navbar from "../navbar/Navbar";

const Header = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <div className="container">{children}</div>
    </div>
  );
};

export default Header;
