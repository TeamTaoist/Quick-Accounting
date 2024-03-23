import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../components/layout/header/Header";
import React, { useEffect, useState } from "react";

import deleteIcon from "../../../assets/workspace/trash.svg";
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
import { NoteHeader } from "../../workspaceDashboard/newPaymentRequest/newPaymentRequest.style";

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
              <h3>New payment request</h3>
              {workspace && (
                <WorkspaceInfo>
                  <WorkspaceLogo>
                    {workspace.avatar === "" ? (
                      <p>{workspace?.name?.slice(0, 1)}</p>
                    ) : (
                      <img src={workspace.avatar} alt={workspace.name} />
                    )}
                  </WorkspaceLogo>
                  <WorkspaceDetails>
                    <h6>{workspace?.name}</h6>
                    <p>{workspace.vault_wallet}</p>
                  </WorkspaceDetails>
                </WorkspaceInfo>
              )}
            </ShareHeader>
            <Request>
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
                    <NoteHeader>
                      <h3>Note Information</h3>
                    </NoteHeader>
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
                        <img src={deleteIcon} alt="" />
                        <p>Delete</p>
                      </DeleteBtn>
                    )}
                  </NoteInformation>
                  {/* <ReactSelect /> */}
                </RequestDetails>
              ))}
            </Request>

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
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 99;
  background-color: var(--clr-modal-mask);
  display: flex;
  justify-content: center;
  align-items: center;
`;
const SharePaymentForm = styled.div`
  background: #fff;
  width: 800px;
  height: 480px;
  outline: 1px solid var(--border-table);
  border-radius: 10px;
  overflow-y: scroll;
  margin: 40px 0;
  /* padding: 40px 0; */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
const ShareHeader = styled.div`
  padding: 40px;
  line-height: 20px;
  height: 152px;
  background: var(--clr-gray-100);
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  h3 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  P {
    font-size: 14px;
    font-weight: 500;
    /* margin-top: 6px; */
  }
`;
const WorkspaceInfo = styled.div`
  padding: 8px 0;
  display: flex;
  align-items: center;
  gap: 6px;
`;
const WorkspaceLogo = styled.div`
  /* margin-top: 20px; */
  padding: 14px 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--clr-gray-200);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    font-weight: 600;
    text-transform: uppercase;
  }
`;
const WorkspaceDetails = styled.div`
  h6 {
    font-size: 14px;
    font-weight: 500;
  }
  p {
    font-size: 12px;
    font-weight: 400;
    color: var(--text-secondary);
  }
`;
const Request = styled.div`
  margin-top: 20px;
  padding-inline: 40px;
`;
const RequestDetails = styled.div`
  /* padding: 40px 30px; */
  padding: 16px 0;
`;

export const NoteInformation = styled.div`
  /* padding-inline: 46px;
  padding-top: 21px; */
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 16px;
  width: 100%;
  border: 1px solid var(--clr-gray-200);
  background: transparent;
  border-top: none;
  padding: 12px 0;
  border-radius: 0 0 7px 7px;
  cursor: pointer;
  img {
    width: 14px;
  }
  p {
    margin-top: 3px;
  }
`;
const Btns = styled.div`
  padding-inline: 40px;
  padding-bottom: 40px;
`;
const AddBtn = styled.button`
  background: #e2e8f0;
  font-size: 16px;
  width: 100%;
  padding: 8px 0;
  border: 1px solid var(--border-table);
  border-style: dotted;
  border-radius: 7px;
  cursor: pointer;
  margin-bottom: 30px;
  margin-top: 6px;
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
  border: 1px solid var(--clr-gray-200);
  background: var(--clr-primary-900);
  color: var(--clr-white);
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
