import styled from "@emotion/styled";

interface ButtonProps {
  icon?: any;
  children: React.ReactNode;
  bg?: string;
  width?: string;
  onClick: () => void;
}

const Button = ({ icon, children, bg, width, onClick }: ButtonProps) => {
  return (
    <Btn bg={bg} width={width} onClick={onClick}>
      <img src={icon} alt="" />
      <span>{children}</span>
    </Btn>
  );
};

export default Button;

export const Btn = styled.button<any>`
  background: ${(props) => props.bg || "transparent"};
  outline: none;
  border: ${(props) => (props.bg ? "none" : "1px solid var(--clr-gray-300)")};
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  width: ${(props) => props.width || "165px"};
  height: 40px;
  cursor: pointer;
  color: #0f172a;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  img {
    width: 16px;
    height: 16px;
  }
`;
