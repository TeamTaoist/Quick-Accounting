import {
  ActionBtn,
  Btn,
} from "../../../pages/workspace/paymentRequest/paymentRequest.style";
import approve from "../../../assets/workspace/approve.svg";
import download from "../../../assets/workspace/archive.svg";
import reject from "../../../assets/workspace/reject.svg";
import { useTranslation } from "react-i18next";

interface ActionButtonProps {
  handleExportPaymentRequestList: () => void;
  handleRejectPaymentRequest: () => void;
  handlePaymentRequestChaiModal: () => void;
}

const ActionButton = ({
  handleExportPaymentRequestList,
  handleRejectPaymentRequest,
  handlePaymentRequestChaiModal,
}: ActionButtonProps) => {
  const { t } = useTranslation();
  return (
    <ActionBtn>
      <Btn onClick={handleExportPaymentRequestList}>
        <img src={download} alt="" />
        <p>{t("paymentRequest.Download")}</p>
      </Btn>
      <Btn onClick={handleRejectPaymentRequest}>
        <img src={reject} alt="" />
        <p>{t("paymentRequest.Reject")}</p>
      </Btn>
      <Btn onClick={() => handlePaymentRequestChaiModal()}>
        <img src={approve} alt="" />
        <p>{t("paymentRequest.Approve")}</p>
      </Btn>
    </ActionBtn>
  );
};

export default ActionButton;
