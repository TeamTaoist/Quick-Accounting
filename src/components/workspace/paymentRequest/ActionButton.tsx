import {
  ActionBtn,
  Btn,
} from "../../../pages/workspace/paymentRequest/paymentRequest.style";
import approve from "../../../assets/workspace/approve.svg";
import download from "../../../assets/workspace/archive.svg";
import reject from "../../../assets/workspace/reject.svg";
import { useTranslation } from "react-i18next";
import Button from "../../button";

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
      <Button
        onClick={handleExportPaymentRequestList}
        icon={download}
        width="112px"
      >
        {t("paymentRequest.Download")}
      </Button>
      <Button onClick={handleRejectPaymentRequest} icon={reject} width="112px">
        {t("paymentRequest.Reject")}
      </Button>
      <Button
        onClick={() => handlePaymentRequestChaiModal()}
        icon={approve}
        width="112px"
      >
        {t("paymentRequest.Approve")}
      </Button>
    </ActionBtn>
  );
};

export default ActionButton;
