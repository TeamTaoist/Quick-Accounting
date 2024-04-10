import styled from "@emotion/styled";
import { CircularProgress } from "@mui/material";
import successIcon from "../assets/success.svg";

interface UpdateLoadingProps {
  isUpdating?: boolean;
  isSuccess?: boolean;
}

const UpdateLoading = ({ isUpdating, isSuccess }: UpdateLoadingProps) => {
  return (
    <UpdateLoadingToast>
      {isUpdating && (
        <PendingLoading>
          <CircularProgress size="14px" sx={{ color: "gray" }} />
          <p>Updating</p>
        </PendingLoading>
      )}
      {isSuccess && (
        <SuccessLoading>
          <img src={successIcon} alt="" /> <p>Update successfully</p>
        </SuccessLoading>
      )}
    </UpdateLoadingToast>
  );
};

export default UpdateLoading;

const UpdateLoadingToast = styled.form`
  p {
    font-size: 12px;
    color: var(--clr-gray-400);
    margin-left: 7px;
  }
`;
export const PendingLoading = styled.form`
  display: flex;
  align-items: center;
`;
const SuccessLoading = styled.form`
  display: flex;
  align-items: center;
  img {
    width: 14px;
  }
`;
