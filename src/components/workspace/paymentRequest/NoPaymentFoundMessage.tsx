import {
  CategoryTitle,
  CreateBtn,
  CreateOptionButton,
} from "../../../pages/workspace/category/category.style";
import add from "../../../assets/workspace/plus-white.svg";
import archive from "../../../assets/workspace/archive.svg";

interface Props {
  setNewPaymentsVisible: (newPaymentsVisible: boolean) => void;
  handleRejectedPayments: () => void;
}

const NoPaymentFoundMessage = ({
  setNewPaymentsVisible,
  handleRejectedPayments,
}: Props) => {
  return (
    <CategoryTitle>
      <h3>No payment request yet.</h3>
      <p style={{ width: "509px", textAlign: "center" }}>
        Payments requests are requested by share link or drafted directly by
        multi-signer will show up here.
      </p>
      <CreateOptionButton>
        <CreateBtn
          onClick={() => setNewPaymentsVisible(true)}
          bg={"var(--clr-primary-900)"}
          clr={"var(--clr-white)"}
        >
          <img src={add} alt="" />
          <span>Payment request</span>
        </CreateBtn>
        <CreateBtn onClick={handleRejectedPayments}>
          <img src={archive} alt="" />
          <span>View rejection</span>
        </CreateBtn>
      </CreateOptionButton>
    </CategoryTitle>
  );
};

export default NoPaymentFoundMessage;
