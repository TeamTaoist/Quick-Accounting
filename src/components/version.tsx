import styled from "@emotion/styled";
import config from "../envConfig";

export default function Version(props: { [key: string]: string }) {
  return (
    <VersionStyle className="version" {...props}>
      {config.version} {process.env.REACT_APP_BUILD_ID?.slice(0, 6)}
    </VersionStyle>
  );
}

const VersionStyle = styled.p`
  color: #ccc;
  font-size: 13px;
  margin-top: 10px;
`;

export const VersionAtRight = styled(Version)`
  position: fixed;
  right: 30px;
  bottom: 30px;
  color: #888;
`;
