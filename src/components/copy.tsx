import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

interface ICopyProps {
  children: React.ReactNode;
  text: string;
  onCopy?: (text: string, result: boolean) => void;
  dir?: "left" | "right";
}

const CopyBox: React.FC<ICopyProps> = ({ children, text, dir }) => {
  const { t } = useTranslation();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (text: string, result: any) => {
    if (result) {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 800);
    }
  };

  return (
    <>
      <CopyToClipboard text={text} onCopy={handleCopy}>
        <CopyContent className="copy-content" dir={dir || "right"}>
          {children}
          {isCopied && <span className="tooltip-content">Copied</span>}
        </CopyContent>
      </CopyToClipboard>
    </>
  );
};

export default CopyBox;

const rightStyle = css`
  .tooltip-content {
    right: -74px;
  }
  .tooltip-content::before {
    right: unset;
    left: -15px;
    transform: translateX(50%) rotate(-90deg);
  }
`;

const CopyContent = styled.div<{ dir: string }>`
  cursor: pointer;
  position: relative;
  display: flex;
  justify-content: space-between;
  gap: 4px;

  .tooltip-content {
    position: absolute;
    padding: 5px 12px;
    border-radius: 8px;
    transition: opacity 0.3s ease, visibility 0.3s ease;
    right: 30px;
    top: -5px;
    white-space: nowrap;
    background: #000;
    color: #fff;
    z-index: 99;
    font-size: 12px;
  }
  .tooltip-content::before {
    content: "";
    position: absolute;
    border: 5px solid transparent;
    border-bottom-color: #000;
    top: 8px;
    right: -6px;
    transform: translateX(50%) rotate(90deg);
  }
  ${({ dir }) => dir === "right" && rightStyle}
`;
