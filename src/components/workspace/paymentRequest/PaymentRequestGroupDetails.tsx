import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import arrowBottom from "../../../assets/workspace/arrow-bottom.svg";
import multiSelect from "../../../assets/workspace/multi-select.svg";
import selectIcon from "../../../assets/workspace/select.svg";
import categoryIcon from "../../../assets/workspace/category-icon.svg";
import optionsIcon from "../../../assets/workspace/option.svg";
import statusIcon from "../../../assets/workspace/status.svg";
import styled from "@emotion/styled";
import usePaymentsStore from "../../../store/usePayments";
import { useLoading } from "../../../store/useLoading";
import {
  DeleteIcon,
  Image,
  NoteHeader,
  NoteInfo,
  NoteInformation,
  RequestSubmit,
} from "../../../pages/workspaceDashboard/newPaymentRequest/newPaymentRequest.style";
import ReactSelect from "../../ReactSelect";
import WorkspaceItemDetailsLayout from "../../layout/WorkspaceItemDetailsLayout";
import { useCategoryProperty } from "../../../store/useCategoryProperty";
import {
  ReactSelectOption,
  Status,
  StatusBtn,
  SubmissionTime,
} from "../../../pages/workspace/paymentRequest/PaymentRequestDetails";
import GroupTextType from "../../paymentRequestGroupDetails/GroupTextType";
import GroupMultiSelectType from "../../paymentRequestGroupDetails/GroupMultiSelectType";
import GroupSingleSelectType from "../../paymentRequestGroupDetails/GroupSingleSelectType";
import { useWorkspace } from "../../../store/useWorkspace";
import { formatTimestamp } from "../../../utils/time";
import { getPaymentStatus } from "../../../utils/payment";
import { useDomainStore } from "../../../store/useDomain";
import UpdateLoading from "../../UpdateLoading";
import GroupDatePickerType from "../../paymentRequestGroupDetails/GroupDatePickerType";
import { Cell, HeaderCell } from "../../table";

interface PaymentRequestDetailsProps {
  setOpen: (open: boolean) => void;
  groupDetails?: IPaymentRequest[];
}
export interface paymentRequestBody {
  id: number;
  amount: string;
  currency_name: string;
  recipient: string;
  decimals: number;
  category_id: null | number;
  category_name: string;
  currency_contract_address?: string;
  category_properties: CategoryProperties[];
}

const PaymentRequestGroupDetails = ({
  setOpen,
  groupDetails,
}: PaymentRequestDetailsProps) => {
  const { id } = useParams();

  const { getWorkspaceCategoryProperties, workspaceCategoryProperties } =
    useCategoryProperty();

  const [selectedValue, setSelectedValue] = useState("Option1");

  const { getPaymentRequestList, updatePaymentRequestCategory } =
    usePaymentsStore();
  const { isLoading } = useLoading();
  const { userWorkspaces, workspace } = useWorkspace();
  const { formatAddressToDomain } = useDomainStore();

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedValue(event.target.value);
  };

  const [age, setAge] = useState("Category");

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  const [selectedValues, setSelectedValues] = useState([]);

  const handleSelectChange = (selectedOptions: any) => {
    setSelectedValues(selectedOptions);
  };

  // update
  const [sharePaymentRequestForm, setSharePaymentRequestForm] = useState<
    paymentRequestBody[]
  >([
    {
      id: 0,
      amount: "",
      currency_name: "",
      recipient: "",
      decimals: 18,
      category_id: null,
      category_name: "",
      currency_contract_address: "",
      category_properties: [],
    },
  ]);

  // handle form value
  const handleFormChange = (
    index: number,
    field: string,
    value: any,
    propertyName?: string,
    propertyType?: string,
    categoryId?: number
  ) => {
    const updatedRequests = [...sharePaymentRequestForm];

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

  const [selectedCategoryIDs, setSelectedCategoryIDs] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<any>([]);

  const handleCategoryDropdown = async (
    categoryId: number,
    categoryName: string,
    index: number,
    paymentId: number
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
      workspaceCategoryProperties?.find((category) => category.ID === id)
    );
    setSelectedCategories(updatedSelectedCategories);
    // update category
    const paymentRequestBody = {
      category_id: categoryId,
      category_name: categoryName,
      category_properties: [],
    };
    await updatePaymentRequestCategory(
      id,
      paymentId.toString(),
      paymentRequestBody
    ).then((res) => {
      if (res) {
        setIsUpdating(false);
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setUpdatingPaymentId(null);
        }, 3000);
      }
    });
  };

  useEffect(() => {
    if (groupDetails && groupDetails.length > 0) {
      const updatedForm = groupDetails.map((paymentDetail) => {
        return {
          id: paymentDetail.ID,
          amount: paymentDetail.amount,
          currency_name: paymentDetail.currency_name,
          recipient: paymentDetail.counterparty,
          decimals: paymentDetail.decimals,
          category_id: paymentDetail.category_id,
          category_name: paymentDetail.category_name,
          currency_contract_address: paymentDetail.currency_contract_address,
          category_properties: Array.isArray(paymentDetail.category_properties)
            ? paymentDetail.category_properties
            : JSON.parse(paymentDetail.category_properties),
          // category_properties: JSON.parse(paymentDetail.category_properties),
        };
      });
      setSharePaymentRequestForm(updatedForm);

      const updatedCategoryIDs = updatedForm.map(
        (formItem) => formItem.category_id
      );
      setSelectedCategoryIDs(updatedCategoryIDs);

      const updatedSelectedCategories = updatedCategoryIDs.map((id: number) =>
        workspaceCategoryProperties?.find((category) => category.ID === id)
      );
      setSelectedCategories(updatedSelectedCategories);
    }
  }, []);

  const [defaultValue, setDefaultValue] = useState<any>([]);
  useEffect(() => {
    setDefaultValue(sharePaymentRequestForm);
  }, []);

  // updating loading state
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [updatingPaymentId, setUpdatingPaymentId] = useState<number | null>(
    null
  );

  const handleUpdatePaymentRequest = async (paymentId: number) => {
    setUpdatingPaymentId(paymentId);
    setIsUpdating(true);
    const selectedPayment = sharePaymentRequestForm.find(
      (f) => f.id === paymentId
    );
    const paymentRequestBody = {
      category_id: selectedPayment?.category_id,
      category_name: selectedPayment?.category_name,
      category_properties: selectedPayment?.category_properties,
    };
    await updatePaymentRequestCategory(
      id,
      paymentId.toString(),
      paymentRequestBody
    ).then((res) => {
      if (res) {
        setIsUpdating(false);
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setUpdatingPaymentId(null);
        }, 3000);
      }
    });
  };
  const [selectedWorkspaceName, setSelectedWorkspaceName] =
    useState<string>("");
  const [selectedWorkspaceAvatar, setSelectedWorkspaceAvatar] =
    useState<string>("");
  const selectedWorkspace = userWorkspaces.data.rows.find(
    (workspace) => workspace.ID === groupDetails?.[0]?.workspace_id
  );
  const [selectedWorkspaceSafeAddress, setSelectedWorkspaceSafeAddress] =
    useState<string>("");
  useEffect(() => {
    if (selectedWorkspace) {
      setSelectedWorkspaceName(selectedWorkspace?.name);
      setSelectedWorkspaceAvatar(selectedWorkspace?.avatar);
      setSelectedWorkspaceSafeAddress(selectedWorkspace.vault_wallet);
    }
  }, []);
  return (
    <>
      <WorkspaceItemDetailsLayout
        title="Payment request details"
        setOpen={setOpen}
        workspaceName={selectedWorkspaceName}
        workspaceAvatar={selectedWorkspaceAvatar}
        address={selectedWorkspaceSafeAddress}
      >
        <RequestDetails>
          {sharePaymentRequestForm.map((payment: any, index: number) => (
            <React.Fragment key={payment.id}>
              <TableContainer
                // sx={{ paddingInline: "40px", paddingTop: "30px" }}
                sx={{
                  boxShadow: "none",
                  border: "1px solid var(--clr-gray-200)",
                  borderRadius: "6px",
                  marginBottom: "30px",
                }}
              >
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <HeaderCell width="280px">Recipient</HeaderCell>
                      <HeaderCell width="220px">Amount</HeaderCell>
                      <HeaderCell width="220px">Currency</HeaderCell>
                    </TableRow>
                  </TableHead>
                  {/* {paymentRequestGroupDetails.map((payment) => ( */}
                  <TableBody>
                    <TableRow>
                      <Cell>
                        <TextField
                          sx={{
                            "& input": {
                              padding: 0,
                            },
                            "& fieldset": { border: "none" },
                          }}
                          // disabled={paymentRequestDetails.status === 1}
                          size="small"
                          value={formatAddressToDomain(
                            payment.recipient,
                            workspace.chain_id,
                            workspace.name_service === "sns"
                          )}
                          fullWidth
                          // id="fullWidth"
                          placeholder="Enter wallet address"
                          InputProps={{
                            style: { padding: 0 },
                            readOnly: true,
                          }}
                        />
                      </Cell>
                      <Cell>
                        <TextField
                          sx={{
                            "& input": {
                              padding: 0,
                            },
                            "& fieldset": { border: "none" },
                          }}
                          // disabled={paymentRequestDetails.status === 1}
                          size="small"
                          value={payment.amount}
                          fullWidth
                          // id="fullWidth"
                          placeholder="Enter wallet address"
                          InputProps={{
                            style: { padding: 0 },
                            readOnly: true,
                          }}
                        />
                      </Cell>
                      <Cell>
                        <Select
                          // disabled={paymentRequestDetails.status === 1}
                          labelId="demo-select-small-label"
                          id="demo-select-small"
                          value={selectedValue}
                          onChange={handleChange}
                          size="small"
                          IconComponent={() => (
                            <InputAdornment position="start">
                              <img
                                src={arrowBottom}
                                alt="Custom Arrow Icon"
                                style={{ marginRight: "8px", width: "16px" }}
                              />
                            </InputAdornment>
                          )}
                          sx={{
                            minWidth: "100%",
                            height: "36px",
                            marginRight: "8px",
                            "&.MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "var(--clr-gray-200)",
                              },
                              "&:hover fieldset": {
                                borderColor: "var(--clr-gray-200)",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "var(--clr-gray-200)",
                              },
                            },
                          }}
                          inputProps={{
                            readOnly: true,
                          }}
                        >
                          <MenuItem
                            value="Option1"
                            sx={{
                              "&:hover": { backgroundColor: "var(--hover-bg)" },
                              "&.Mui-selected": {
                                backgroundColor: "var(--hover-bg)",
                              },
                            }}
                          >
                            {payment.currency_name}
                          </MenuItem>
                        </Select>
                      </Cell>
                    </TableRow>
                  </TableBody>
                  {/* ))} */}
                </Table>
                {/* </TableContainer> */}
                {/* note info */}
                <NoteInformation>
                  <NoteHeader>
                    <h3>Note Information</h3>
                    {updatingPaymentId === payment.id && (
                      <UpdateLoading
                        isUpdating={isUpdating}
                        isSuccess={isSuccess}
                      />
                    )}
                  </NoteHeader>
                  {/* {paymentRequestGroupDetails.map((payment) => ( */}
                  {/* <TableContainer> */}
                  <Table aria-label="simple table">
                    <TableBody>
                      <TableRow>
                        <Cell width="220px">
                          <NoteInfo>
                            <Image src={categoryIcon} alt="" /> Category
                          </NoteInfo>
                        </Cell>
                        <Cell width="500px">
                          <FormControl
                            fullWidth
                            // disabled={paymentRequestDetails.status === 1}
                          >
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={
                                sharePaymentRequestForm[index].category_name
                              }
                              label={
                                sharePaymentRequestForm[index].category_name
                              }
                              size="small"
                              IconComponent={() => (
                                <InputAdornment position="start">
                                  <img
                                    src={arrowBottom}
                                    alt="Custom Arrow Icon"
                                    style={{ marginRight: "20px" }}
                                  />
                                </InputAdornment>
                              )}
                              sx={{
                                minWidth: "100%",
                                height: "42px",
                                padding: 0,
                                paddingInline: "1px",
                                "& .MuiSelect-select": {
                                  display: "block",
                                },
                                "&.MuiOutlinedInput-root": {
                                  border: "1px solid var(--clr-gray-200)",
                                  "& fieldset": {
                                    border: "none",
                                  },
                                  "&:hover fieldset": {
                                    border: "none",
                                  },
                                  "&.Mui-focused fieldset": {
                                    border: "none",
                                  },
                                },
                                // "& fieldset": { border: "none" },
                                "& .MuiInputLabel-root": { display: "none" },
                              }}
                            >
                              <MenuItem disabled value="Category">
                                {sharePaymentRequestForm[index].category_name}
                              </MenuItem>
                              {/* dynamic category */}
                              {workspaceCategoryProperties?.map((category) => (
                                <MenuItem
                                  key={category.ID}
                                  value={category.name}
                                  onClick={() => {
                                    handleCategoryDropdown(
                                      category.ID,
                                      category.name,
                                      index,
                                      payment.id
                                    );
                                  }}
                                  sx={{
                                    "&:hover": {
                                      backgroundColor: "var(--clr-gray-100)",
                                    },
                                    "&.Mui-selected": {
                                      backgroundColor: "var(--clr-gray-200)",
                                    },
                                  }}
                                >
                                  {category.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Cell>
                      </TableRow>
                      {selectedCategories[index]?.properties?.map(
                        (properties: ICategoryProperties, i: number) => (
                          <React.Fragment key={i}>
                            {properties.type === "single-select" && (
                              <GroupSingleSelectType
                                properties={properties}
                                handleUpdatePaymentRequest={
                                  handleUpdatePaymentRequest
                                }
                                sharePaymentRequestForm={
                                  sharePaymentRequestForm
                                }
                                payment={payment}
                                index={index}
                                handleFormChange={handleFormChange}
                                selectedValues={selectedValues}
                                defaultPropertyValue={
                                  sharePaymentRequestForm[
                                    index
                                  ].category_properties.filter(
                                    (p: any) =>
                                      p.type === "single-select" &&
                                      p.name === properties.name
                                  )[0]
                                }
                              />
                            )}
                          </React.Fragment>
                        )
                      )}
                      {selectedCategories[index]?.properties?.map(
                        (properties: ICategoryProperties, i: number) => (
                          <React.Fragment key={i}>
                            {properties.type === "multi-select" && (
                              <GroupMultiSelectType
                                properties={properties}
                                handleUpdatePaymentRequest={
                                  handleUpdatePaymentRequest
                                }
                                sharePaymentRequestForm={
                                  sharePaymentRequestForm
                                }
                                payment={payment}
                                index={index}
                                handleFormChange={handleFormChange}
                                selectedValues={selectedValues}
                                defaultPropertyValue={
                                  sharePaymentRequestForm[
                                    index
                                  ].category_properties.filter(
                                    (p: any) =>
                                      p.type === "multi-select" &&
                                      p.name === properties.name
                                  )[0]
                                }
                              />
                            )}
                          </React.Fragment>
                        )
                      )}
                      {selectedCategories[index]?.properties?.map(
                        (properties: ICategoryProperties, i: number) => (
                          <React.Fragment key={i}>
                            {properties.type === "Text" && (
                              <GroupTextType
                                properties={properties}
                                handleUpdatePaymentRequest={
                                  handleUpdatePaymentRequest
                                }
                                sharePaymentRequestForm={
                                  sharePaymentRequestForm
                                }
                                payment={payment}
                                index={index}
                                handleFormChange={handleFormChange}
                                defaultPropertyValue={
                                  sharePaymentRequestForm[
                                    index
                                  ].category_properties.filter(
                                    (p: any) =>
                                      p.type === "Text" &&
                                      p.name === properties.name
                                  )[0]
                                }
                              />
                            )}
                          </React.Fragment>
                        )
                      )}
                      {selectedCategories[index]?.properties?.map(
                        (properties: ICategoryProperties, i: number) => (
                          <React.Fragment key={i}>
                            {properties.type === "date-picker" && (
                              <GroupDatePickerType
                                properties={properties}
                                handleUpdatePaymentRequest={
                                  handleUpdatePaymentRequest
                                }
                                sharePaymentRequestForm={
                                  sharePaymentRequestForm
                                }
                                payment={payment}
                                index={index}
                                handleFormChange={handleFormChange}
                                defaultPropertyValue={
                                  sharePaymentRequestForm[
                                    index
                                  ].category_properties.filter(
                                    (p: any) =>
                                      p.type === "date-picker" &&
                                      p.name === properties.name
                                  )[0]
                                }
                              />
                            )}
                          </React.Fragment>
                        )
                      )}
                    </TableBody>
                  </Table>
                  {/* </TableContainer> */}
                  {/* ))} */}
                </NoteInformation>
              </TableContainer>
            </React.Fragment>
          ))}
          <SubmissionTime>
            <p>Submission time</p>
            <div>{formatTimestamp(groupDetails?.[0]?.submit_ts || 0)}</div>
          </SubmissionTime>
          <Status status={getPaymentStatus(groupDetails?.[0]?.status || 0)}>
            <h6>Status</h6>
            <div>
              <p></p>
              {getPaymentStatus(groupDetails?.[0]?.status || 0)}
            </div>
          </Status>
        </RequestDetails>
      </WorkspaceItemDetailsLayout>
    </>
  );
};

export default PaymentRequestGroupDetails;

const RequestDetails = styled.div`
  margin: 30px 37px;
`;
