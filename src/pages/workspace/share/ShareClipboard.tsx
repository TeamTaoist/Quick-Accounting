import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { useWorkspace } from "../../../store/useWorkspace";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";

const ShareClipboard = () => {
  const { workspace } = useWorkspace();

  const [link, setLink] = useState("");

  const handleCopy = () => {
    toast.success("Copied successfully");
  };
  useEffect(() => {
    const baseUrl = window.location.origin;
    const workspaceId = workspace.ID;
    const shareLink = `${baseUrl}/workspace/${workspaceId}/new-workspace-payment-request`;
    setLink(shareLink);
  }, []);

  return (
    <ShareContainer>
      <CopyToClipboard text={link} onCopy={handleCopy}>
        <h1>The share link has been copied to your clipboard!</h1>
      </CopyToClipboard>
    </ShareContainer>
  );
};

export default ShareClipboard;

const ShareContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: grid;
  align-items: center;
  justify-content: center;
  h1 {
    font-size: 28px;
    font-weight: 400;
    cursor: pointer;
  }
`;
