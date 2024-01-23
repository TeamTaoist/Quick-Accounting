import Navbar from "../navbar/Navbar";

const Header = ({ children, ...props }: { children: React.ReactNode }) => {
  return (
    <div {...props}>
      <Navbar />
      <div className="container">{children}</div>
    </div>
  );
};

export default Header;
