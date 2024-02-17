import styled from "@emotion/styled";
import reject from "../../../assets/workspace/reject.svg";
import back from "../../../assets/workspace/back.svg";
import view from "../../../assets/workspace/view.svg";
import { CategoryTitle } from "../category/category.style";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RejectDataTable from "../../../components/workspace/paymentRequest/RejectPaymentRequestTable";
import { Image, ViewReject } from "../paymentRequest/paymentRequest.style";
import { useTranslation } from "react-i18next";
import CustomModal from "../../../utils/CustomModal";
import PaymentRequestDetails from "../paymentRequest/PaymentRequestDetails";
import { useSafeStore } from "../../../store/useSafeStore";
import { useWorkspace } from "../../../store/useWorkspace";
import usePaymentsStore from "../../../store/usePayments";
import { TransactionListItemType } from "@safe-global/safe-gateway-typescript-sdk";
import QueueItem from "../../../components/workspace/QueueItem";
import { BookkeepingTitle, HideBtn } from "../bookkeeping/Bookkeeping";

const Queue = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  const { getQueueTx, isReady } = useSafeStore();
  const { workspace, assetsList, getAssets } = useWorkspace();
  const { getPaymentRequestBySafeTxHash } = usePaymentsStore();

  const [paymentRequest, setPaymentRequest] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [list, setList] = useState<IQueueGroupItemProps[]>([]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const workspaceId = Number(id);

  const getQueueList = async () => {
    const data = await getQueueTx(workspace.chain_id, workspace.vault_wallet);
    data && setList(data);
  };

  useEffect(() => {
    isReady && workspace?.vault_wallet && getQueueList();
  }, [isReady, workspace?.vault_wallet]);

  useEffect(() => {
    if (!assetsList.length && workspace.ID) {
      getAssets();
    }
  }, [assetsList, workspace]);

  useEffect(() => {
    const ids: string[] = [];
    list.forEach((item) => {
      if (item.type === TransactionListItemType.TRANSACTION) {
        if (item.transactions?.[0]) {
          ids.push(item.transactions?.[0].safeTxHash);
        }
      }
    });
    workspaceId &&
      ids.length &&
      getPaymentRequestBySafeTxHash(workspaceId, ids);
  }, [list, workspaceId]);

  const afterExecute = () => {
    getQueueList();
  };

  return (
    <QueueSection>
      {list.length === 0 && paymentRequest ? (
        <BookkeepingTitle>
          <h3>You don't have any transactions.</h3>
          <p style={{ width: "450px", textAlign: "center" }}>
            Transactions that add tokens to or remove tokens from your Safe will
            show up here.
          </p>
          <HideBtn onClick={() => setPaymentRequest(!paymentRequest)}>
            <img src={view} alt="" style={{ width: "20px" }} />
            <span>View rejection</span>
          </HideBtn>
        </BookkeepingTitle>
      ) : (
        <QueueContainer>
          <QueHeader>
            <ViewReject onClick={() => setPaymentRequest(!paymentRequest)}>
              {paymentRequest ? (
                <div>
                  <Image src={reject} alt="" />
                  <p>{t("paymentRequest.ViewRejection")}</p>
                </div>
              ) : (
                <div>
                  <Image src={back} alt="" />
                  <p>{t("paymentRequest.Back")}</p>
                </div>
              )}
            </ViewReject>
          </QueHeader>
          {/*  */}
          {paymentRequest && (
            <>
              {list.map((item, index) => (
                <QueueItem
                  data={item}
                  key={index}
                  handleOpenModal={handleOpenModal}
                  afterExecute={afterExecute}
                />
              ))}
            </>
          )}
          <CustomModal
            open={openModal}
            setOpen={setOpenModal}
            component={PaymentRequestDetails}
          />
        </QueueContainer>
      )}
      {!paymentRequest && (
        <RejectSection>
          <RejectDataTable isInQueue />
        </RejectSection>
      )}
    </QueueSection>
  );
};

export default Queue;
const QueueContainer = styled.div`
  padding: 30px 0;
`;

const QueueSection = styled.div`
  padding-top: 40px;
  margin-inline: 40px;
`;
const QueHeader = styled.div`
  display: flex;
  justify-content: end;
`;
export const RejectSection = styled.div`
  margin-top: 50px;
`;
