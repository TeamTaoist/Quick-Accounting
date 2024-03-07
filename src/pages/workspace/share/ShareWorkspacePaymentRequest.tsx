import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../components/layout/header/Header";
import React, { useEffect, useState } from "react";
import {
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";

import categoryIcon from "../../../assets/workspace/category-icon.svg";
import styled from "@emotion/styled";
import ReactSelect from "../../../components/ReactSelect";
import { useLoading } from "../../../store/useLoading";
import Loading from "../../../utils/Loading";
import { useWorkspace } from "../../../store/useWorkspace";
import { useSharePaymentRequest } from "../../../store/useSharePaymentRequest";
import { ReactSelectOption } from "../../workspaceDashboard/newPaymentRequest/NewPaymentRequest";
import { formatBalance } from "../../../utils/number";
import { toast } from "react-toastify";
import { isAddress, zeroAddress } from "viem";
import { parseUnits } from "ethers";
import ConfirmModal from "../../../components/confirmModal";
import PaymentDetailsForm from "../../../components/paymentRequestGroupDetails/PaymentDetailsForm";
import GroupPaymentCategoryProperties from "../../../components/paymentRequestGroupDetails/GroupPaymentCategoryProperties";
import LoginContent from "../../auth/login/LoginContent";
import useLogin from "../../../hooks/useLogin";
import { useAuthStore } from "../../../store/useAuthStore";
import { useDomainStore } from "../../../store/useDomain";

const ShareWorkspacePaymentRequest = () => {
  const { shareId } = useParams();
  const navigate = useNavigate();

  const { isLoading, setLoading } = useLoading();
  const { workspace, assetsList, getAssets, updateWorkspace, getHideAssets } =
    useWorkspace();
  const {
    createSharePaymentRequest,
    getPaymentRequestShareCodeData,
    saveSharePaymentRequest,
    shareData,
  } = useSharePaymentRequest();
  // const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);
  const [loginVisible, setLoginVisible] = useState(false);
  const signAndLogin = useLogin();
  const { user } = useAuthStore();
  const {
    parseENS,
    parseSNS,
    formatAddressToDomain,
    queryENSForcibly,
    querySNSForcibly,
  } = useDomainStore();
  const [nameAddressMap, setNameAddressMap] = useState<Map<string, string>>(
    new Map()
  );

  // dynamic payment request form
  const [sharePaymentRequestForm, setSharePaymentRequestForm] = useState<
    SharePaymentRequestBody[]
  >([
    {
      amount: "",
      currency_name: "",
      recipient: "",
      counterparty: "",
      decimals: 18,
      category_id: null,
      category_name: "",
      currency_contract_address: "",
      category_properties: [],
    },
  ]);

  const handleAddRequest = () => {
    setSharePaymentRequestForm([
      ...sharePaymentRequestForm,
      {
        amount: "",
        currency_name: "",
        recipient: "",
        decimals: 18,
        category_id: null,
        category_name: "",
        category_properties: [],
      },
    ]);
  };
  const handleFormChange = (
    index: number,
    field: string,
    value: any,
    propertyName?: string,
    propertyType?: string,
    categoryId?: number
  ) => {
    const updatedRequests = [...sharePaymentRequestForm];
    if (field === "currency_address") {
      const token = assetsList.find((item) => item.tokenInfo.address === value);
      if (token) {
        updatedRequests[index].currency_name = token.tokenInfo.symbol;
        updatedRequests[index].decimals = token.tokenInfo.decimals;
      }
      updatedRequests[index].currency_contract_address = value;
    }

    if (field === "categoryProperties") {
      const existingCategoryProperty = updatedRequests[
        index
      ].category_properties.find(
        (property) =>
          property.name === propertyName && property.type === propertyType
      );

      if (existingCategoryProperty) {
        const values =
          propertyType === "single-select"
            ? value.value
            : propertyType === "Text"
            ? value
            : propertyType === "date-picker"
            ? value
            : value.map((v: ReactSelectOption) => v.value).join(";");

        existingCategoryProperty.values = values;
      } else {
        const newCategoryProperty =
          propertyType === "Text" || propertyType === "date-picker"
            ? {
                name: propertyName,
                type: propertyType,
                values: value,
              }
            : {
                name: propertyName,
                type: propertyType,
                values:
                  propertyType === "single-select"
                    ? value.value
                    : value.map((v: ReactSelectOption) => v.value).join(";"),
              };

        updatedRequests[index].category_properties.push(newCategoryProperty);
      }
    } else {
      (updatedRequests[index] as any)[field] = value;
    }
    setSharePaymentRequestForm(updatedRequests);
  };

  const handleDeleteRequestForm = (index: number) => {
    const updatedRequest = sharePaymentRequestForm.filter(
      (_, i) => i !== index
    );
    setSharePaymentRequestForm(updatedRequest);
  };

  // get category details

  const [shareDataLoading, setShareDataLoading] = useState<boolean>(false);
  // get payment request details
  useEffect(() => {
    const fetchPaymentRequestData = async () => {
      await getPaymentRequestShareCodeData(shareId).then((res) => {
        if (res) {
          updateWorkspace(res);
        }
      });
    };
    fetchPaymentRequestData();
  }, [shareDataLoading]);

  const [selectedCategoryIDs, setSelectedCategoryIDs] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<any>([]);

  const handleCategoryDropdown = (
    categoryId: number,
    categoryName: string,
    index: number
  ) => {
    const updatedCategoryIDs = [...selectedCategoryIDs];
    updatedCategoryIDs[index] = categoryId;
    setSelectedCategoryIDs(updatedCategoryIDs);

    const updatedRequests = [...sharePaymentRequestForm];
    updatedRequests[index] = {
      ...updatedRequests[index],
      category_id: categoryId,
      category_name: categoryName,
      category_properties: [],
    };
    setSharePaymentRequestForm(updatedRequests);
    const updatedSelectedCategories = updatedCategoryIDs.map((id: any) =>
      shareData?.category_and_properties?.find((category) => category.ID === id)
    );
    setSelectedCategories(updatedSelectedCategories);
  };
  // get asset list
  useEffect(() => {
    const fetchAssetsList = async () => {
      workspace?.vault_wallet && (await getAssets());
      workspace?.vault_wallet && (await getHideAssets());
    };
    fetchAssetsList();
  }, [workspace?.vault_wallet]);

  // modal
  const [openModal, setOpenModal] = useState(false);

  const checkRecipient = async () => {
    const sns_check_list: string[] = [];
    const ens_check_list: string[] = [];
    for (const item of sharePaymentRequestForm) {
      if (item.recipient.endsWith(".seedao")) {
        sns_check_list.push(item.recipient);
      } else if (item.recipient.endsWith(".eth")) {
        ens_check_list.push(item.recipient);
      }
    }
    const name_address_map = new Map<string, string>();
    if (sns_check_list.length) {
      const res = await parseSNS(Array.from(new Set(sns_check_list)));
      for (let i = 0; i < sns_check_list.length; i++) {
        if (res[i] === zeroAddress) {
          toast.error(`Invalid SNS: ${sns_check_list[i]}`);
          return;
        }
        name_address_map.set(sns_check_list[i], res[i]);
      }
    }

    if (ens_check_list.length) {
      const res = await parseENS(
        Array.from(new Set(ens_check_list)),
        workspace.chain_id
      );
      for (let i = 0; i < ens_check_list.length; i++) {
        if (!res[i]) {
          toast.error(`Invalid ENS: ${ens_check_list[i]}`);
          return;
        }
        name_address_map.set(ens_check_list[i], res[i]!);
      }
    }
    return name_address_map;
  };

  const checkAllFields = async () => {
    if (!sharePaymentRequestForm.length) {
      return;
    }
    const sns_check_list: string[] = [];
    const ens_check_list: string[] = [];
    for (const item of sharePaymentRequestForm) {
      if (!item.recipient || !item.amount || !item.currency_contract_address) {
        toast.error("Please fill all fields");
        return;
      }
      if (Number(item.amount) <= 0) {
        toast.error(`Invalid amount: ${item.amount}`);
        return;
      }
      try {
        const amountBigInt = parseUnits(item.amount, item.decimals);
        const selectToken = assetsList.find(
          (s) => s.tokenInfo.address === item.currency_contract_address
        );
        if (BigInt(selectToken?.balance || 0) < amountBigInt) {
          toast.error(
            `Insufficient balance: ${item.amount} ${item.currency_name}`
          );
          return;
        }
      } catch (error) {
        toast.error(`Invalid decimal amount: ${item.amount}`);
        return;
      }
      if (item.recipient.endsWith(".seedao")) {
        sns_check_list.push(item.recipient);
      } else if (item.recipient.endsWith(".eth")) {
        ens_check_list.push(item.recipient);
      } else if (!isAddress(item.recipient)) {
        toast.error(`Invalid address: ${item.recipient}`);
        return;
      }
    }
    const name_address_map = new Map<string, string>();
    if (sns_check_list.length) {
      const res = await parseSNS(Array.from(new Set(sns_check_list)));
      for (let i = 0; i < sns_check_list.length; i++) {
        if (res[i] === zeroAddress) {
          toast.error(`Invalid SNS: ${sns_check_list[i]}`);
          return;
        }
        name_address_map.set(sns_check_list[i], res[i]);
      }
    }

    if (ens_check_list.length) {
      const res = await parseENS(
        Array.from(new Set(ens_check_list)),
        workspace.chain_id
      );
      for (let i = 0; i < ens_check_list.length; i++) {
        if (!res[i]) {
          toast.error(`Invalid ENS: ${ens_check_list[i]}`);
          return;
        }
        name_address_map.set(ens_check_list[i], res[i]!);
      }
    }
    return name_address_map;
  };

  const handleConfirmSubmit = (_nameAddressMap: Map<string, string>) => {
    createSharePaymentRequest(shareId, {
      rows: sharePaymentRequestForm.map((r) => ({
        ...r,
        recipient: _nameAddressMap.get(r.recipient) || r.recipient,
      })),
      sharePaymentRequestForm,
    }).then((res) => {
      if (res) {
        // setConfirmVisible(false);
        getPaymentRequestShareCodeData(shareId);
      }
    });
  };

  const handleLoginCallback = (_nameAddressMap: Map<string, string>) => {
    setLoginVisible(false);
    handleConfirmSubmit(_nameAddressMap);
  };

  // create payment request
  const handleSubmitPaymentRequest = async () => {
    // check all of fields
    setLoading(true);
    const name_address_map = await checkAllFields();
    setLoading(false);
    if (!name_address_map) {
      return;
    }
    setNameAddressMap(name_address_map);

    // setConfirmVisible(true);
    if (!user?.token) {
      setLoginVisible(true);
      return;
    }
    try {
      setLoading(true);
      await signAndLogin(() => handleLoginCallback(name_address_map));
    } catch (error) {
      toast.error(`login failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };
  const handleSavePaymentRequest = async () => {
    setLoading(true);
    const _nameAddressMap = await checkRecipient();
    setLoading(false);
    if (!_nameAddressMap) {
      return;
    }
    await saveSharePaymentRequest(shareId, {
      rows: sharePaymentRequestForm.map((r) => ({
        ...r,
        recipient: _nameAddressMap.get(r.recipient) || r.recipient,
      })),
    });
  };

  const parseShareData = async () => {
    if (shareData && shareData.payment_request_items !== null) {
      const wallets: string[] = shareData?.payment_request_items?.map(
        (p) => p.counterparty
      );
      const address_to_name =
        workspace.name_service === "sns"
          ? await querySNSForcibly(wallets)
          : await queryENSForcibly(wallets, workspace.chain_id);

      const updatedForm = shareData?.payment_request_items?.map(
        (paymentDetail) => {
          const m = formatAddressToDomain(
            paymentDetail.counterparty,
            workspace.chain_id,
            workspace.name_service === "sns"
          );
          return {
            amount: paymentDetail.amount,
            currency_name: paymentDetail.currency_name,
            recipient:
              address_to_name.get(paymentDetail.counterparty) ||
              paymentDetail.counterparty,
            decimals: paymentDetail.decimals,
            category_id: paymentDetail.category_id,
            category_name: paymentDetail.category_name,
            currency_contract_address: paymentDetail.currency_contract_address,
            category_properties: Array.isArray(
              paymentDetail.category_properties
            )
              ? paymentDetail.category_properties
              : JSON.parse(paymentDetail.category_properties),
          };
        }
      );
      setSharePaymentRequestForm(updatedForm);

      const updatedCategoryIDs = updatedForm.map(
        (formItem) => formItem.category_id
      );
      setSelectedCategoryIDs(updatedCategoryIDs);

      const updatedSelectedCategories = updatedCategoryIDs.map((id: number) =>
        shareData?.category_and_properties?.find(
          (category) => category.ID === id
        )
      );
      setSelectedCategories(updatedSelectedCategories);
    }
  };

  useEffect(() => {
    parseShareData();
  }, [shareData, workspace, formatAddressToDomain]);
  const isEditable =
    shareData?.payment_request_items?.[0]?.status !== 0 &&
    shareData?.payment_request_items !== null;

  return (
    <>
      {isLoading && <Loading />}
      <Header>
        <SharePaymentContainer>
          <SharePaymentForm>
            <ShareHeader>
              <h3>New payment request from {workspace.name}</h3>
            </ShareHeader>
            {sharePaymentRequestForm.map((value, index) => (
              <RequestDetails key={index}>
                <PaymentDetailsForm
                  value={value}
                  handleFormChange={handleFormChange}
                  index={index}
                  isEditable={isEditable}
                  sharePaymentRequestForm={sharePaymentRequestForm}
                />
                {/* note info */}
                <NoteInformation>
                  <h3>Note Information</h3>
                  <GroupPaymentCategoryProperties
                    sharePaymentRequestForm={sharePaymentRequestForm}
                    index={index}
                    isEditable={isEditable}
                    handleCategoryDropdown={handleCategoryDropdown}
                    selectedCategories={selectedCategories}
                    selectedValues={selectedValues}
                    handleFormChange={handleFormChange}
                  />

                  {!isEditable && (
                    <DeleteBtn onClick={() => handleDeleteRequestForm(index)}>
                      Delete
                    </DeleteBtn>
                  )}
                </NoteInformation>
                {/* <ReactSelect /> */}
              </RequestDetails>
            ))}
            {shareData?.payment_request_items?.[0]?.status !== 0 &&
            shareData?.payment_request_items?.length ? (
              <Btns>
                <ViewProgressBtn
                  onClick={() => navigate("/user/payment-request")}
                >
                  View the progress of your payment request
                </ViewProgressBtn>
              </Btns>
            ) : (
              <Btns>
                <AddBtn onClick={handleAddRequest}>+ Add</AddBtn>
                <SubmitBtns>
                  <Save onClick={handleSavePaymentRequest}>Save</Save>
                  <Submit onClick={handleSubmitPaymentRequest}>Submit</Submit>
                </SubmitBtns>
              </Btns>
            )}
            {/* </>
            )} */}
            {/* {confirmVisible && (
              <ConfirmModal
                msg="Confirm to submit?"
                onConfirm={handleConfirmSubmit}
                onClose={() => setConfirmVisible(false)}
              />
            )} */}
          </SharePaymentForm>
        </SharePaymentContainer>
        {loginVisible && (
          <LoginModal>
            <LoginContent
              handleClose={() => setLoginVisible(false)}
              loginCallback={() => handleLoginCallback(nameAddressMap)}
            />
          </LoginModal>
        )}
      </Header>
    </>
  );
};

export default ShareWorkspacePaymentRequest;

const SharePaymentContainer = styled.div`
  /* display: grid; */
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding-top: 100px;
`;
const SharePaymentForm = styled.div`
  width: 757px;
  outline: 1px solid var(--border-table);
  border-radius: 10px;
  overflow: hidden;
  margin: 40px 0;
  /* padding: 40px 0; */
`;
const RequestDetails = styled.div`
  padding: 40px 30px;
`;
const ShareHeader = styled.div`
  height: 98px;
  background: var(--bg-secondary);
  padding: 22px 26px;
  h3 {
    font-size: 30px;
    font-weight: 500;
  }
`;

export const NoteInformation = styled.div`
  /* padding-inline: 46px;
  padding-top: 21px; */

  h3 {
    font-size: 18px;
    font-weight: 500;
    padding: 8px;
    padding-left: 16px;
    background: var(--bg-primary);
  }
`;
export const Image = styled.img`
  width: 16px;
`;
export const NoteInfo = styled.div`
  display: flex;
  gap: 6px;
`;
export const RequestSubmit = styled.button`
  background: var(--bg-primary);
  border: none;
  outline: none;
  font-size: 18px;
  font-weight: 400;
  padding: 10px 0;
  width: 100%;
  border-radius: 4px;
  margin-top: 21px;
  cursor: pointer;
  color: var(--text-primary);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  img {
    width: 10px;
  }
`;
const DeleteBtn = styled.button`
  font-size: 18px;
  width: 100%;
  border: 1px solid var(--border-table);
  padding: 8px 0;
  border-radius: 0 0 7px 7px;
  cursor: pointer;
`;
const Btns = styled.div`
  padding-inline: 30px;
  padding-bottom: 40px;
`;
const AddBtn = styled.button`
  background: transparent;
  font-size: 16px;
  color: var(--text-secondary);
  width: 100%;
  padding: 8px 0;
  border: 1px solid var(--border-table);
  border-style: dotted;
  border-radius: 7px;
  cursor: pointer;
  margin-bottom: 30px;
`;
const ViewProgressBtn = styled.button`
  background: var(--bg-primary);
  font-size: 16px;
  width: 100%;
  padding: 8px 0;
  border: 1px solid var(--border-table);
  border-radius: 7px;
  cursor: pointer;
  margin: 20px 0;
  padding-inline: 30px;
`;
const SubmitBtns = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
`;
const Save = styled.button`
  font-size: 18px;
  width: 100%;
  border: 1px solid var(--border-table);
  padding: 8px 0;
  border-radius: 7px;
  cursor: pointer;
`;
const Submit = styled.button`
  background: transparent;
  font-size: 18px;
  width: 100%;
  padding: 8px 0;
  border: 1px solid var(--border-table);
  border-radius: 7px;
  cursor: pointer;
`;

const LoginModal = styled.div`
  background: rgba(10, 22, 11, 0.4);
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 9;
  left: 0;
  top: 0;
`;
