import styled from "@emotion/styled";
import BasicModal from "./basicModal";
import { useTranslation } from "react-i18next";

interface IProps {
  title?: string;
  msg: string;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmModal({
  title,
  msg,
  onConfirm,
  onClose,
}: IProps) {
  const { t } = useTranslation();
  return (
    <BasicModal title={title} handleClose={onClose} style={{ width: "400px" }}>
      <CardText>{msg}</CardText>
      <CardFooter>
        <CancelButton onClick={onClose}>{t("general.Cancel")}</CancelButton>
        <ButtonStyle onClick={onConfirm}>{t("general.Confirm")}</ButtonStyle>
      </CardFooter>
    </BasicModal>
  );
}

const CardText = styled.div`
  font-size: 20px;
  line-height: 24px;
  margin-block: 24px;
  text-align: center;
  .danger {
    font-size: 40px;
    margin-block: 20px;
  }
`;

const CardFooter = styled.div`
  text-align: center;
  margin-top: 40px;
  button {
    width: 110px;
    &:last-of-type {
      margin-left: 20px;
    }
  }
`;

const ButtonStyle = styled.button`
  font-size: 18px;
  width: 100%;
  border: 1px solid var(--border-table);
  padding: 8px 0;
  border-radius: 7px;
  cursor: pointer;
`;

const CancelButton = styled(ButtonStyle)`
  background: transparent;
`;
