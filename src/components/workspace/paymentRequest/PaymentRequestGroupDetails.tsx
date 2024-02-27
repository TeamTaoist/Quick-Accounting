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
  NoteInfo,
  NoteInformation,
  RequestSubmit,
} from "../../../pages/workspaceDashboard/newPaymentRequest/newPaymentRequest.style";
import ReactSelect from "../../ReactSelect";
import WorkspaceItemDetailsLayout from "../../layout/WorkspaceItemDetailsLayout";
import { useCategoryProperty } from "../../../store/useCategoryProperty";
import { ReactSelectOption } from "../../../pages/workspace/paymentRequest/PaymentRequestDetails";
import GroupTextType from "../../paymentRequestGroupDetails/GroupTextType";
import GroupMultiSelectType from "../../paymentRequestGroupDetails/GroupMultiSelectType";
import GroupSingleSelectType from "../../paymentRequestGroupDetails/GroupSingleSelectType";

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

  console.log("form data", sharePaymentRequestForm);
  console.log("group details", groupDetails);

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
            : value.map((v: ReactSelectOption) => v.value).join(";");

        existingCategoryProperty.values = values;
      } else {
        const newCategoryProperty =
          propertyType === "Text"
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
  console.log("selectedCategoryIDs", selectedCategoryIDs);
  console.log("selectedCategories", selectedCategories);

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
      workspaceCategoryProperties?.find((category) => category.ID === id)
    );
    setSelectedCategories(updatedSelectedCategories);
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
  console.log("default value", defaultValue);

  const handleUpdatePaymentRequest = async (paymentId: number) => {
    const selectedPayment = sharePaymentRequestForm.find(
      (f) => f.id === paymentId
    );
    const paymentRequestBody = {
      category_id: selectedPayment?.category_id,
      category_name: selectedPayment?.category_name,
      category_Properties: selectedPayment?.category_properties,
    };
    await updatePaymentRequestCategory(
      id,
      paymentId.toString(),
      paymentRequestBody
    );
    getPaymentRequestList(Number(id), false);
  };
  const data = {
    workspace_avatar: "",
    workspace_name: "Workspace name",
    address: "0x27D4539d19b292b68369Ed588d682Db3aF679005",
  };

  return (
    <>
      <WorkspaceItemDetailsLayout
        title="Payment request details"
        setOpen={setOpen}
        data={data}
      >
        <RequestDetails>
          {sharePaymentRequestForm.map((payment: any, index: number) => (
            <React.Fragment key={payment.ID}>
              <TableContainer
                sx={{ paddingInline: "40px", paddingTop: "30px" }}
              >
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          width: "30%",
                          border: 0,
                          paddingInline: 0,
                        }}
                      >
                        Recipient
                      </TableCell>
                      <TableCell
                        sx={{ width: "23%", border: 0, paddingInline: 0 }}
                      >
                        Amount
                      </TableCell>
                      <TableCell
                        sx={{ width: "37%", border: 0, paddingInline: 0 }}
                      >
                        Currency
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  {/* {paymentRequestGroupDetails.map((payment) => ( */}
                  <TableBody>
                    <TableRow
                      sx={{
                        height: "30px",
                        borderRadius: "10px",
                      }}
                    >
                      <TableCell
                        // size="small"
                        sx={{
                          border: "1px solid var(--border-table)",
                          padding: 0,
                        }}
                      >
                        <TextField
                          sx={{
                            "& fieldset": { border: "none" },
                          }}
                          // disabled={paymentRequestDetails.status === 1}
                          size="small"
                          value={payment.recipient}
                          fullWidth
                          // id="fullWidth"
                          placeholder="Enter wallet address"
                          InputProps={{
                            style: { padding: 0 },
                            readOnly: true,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          border: "1px solid var(--border-table)",
                          borderRadius: "5px",
                          padding: 0,
                          paddingLeft: "10px",
                          // minHeight: "40px",
                        }}
                      >
                        <TextField
                          sx={{
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
                      </TableCell>
                      <TableCell
                        sx={{
                          border: "1px solid var(--border-table)",
                          padding: 0,
                          // minHeight: "40px",
                        }}
                      >
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
                                style={{ marginRight: "50px" }}
                              />
                            </InputAdornment>
                          )}
                          sx={{
                            minWidth: "100%",
                            "& fieldset": { border: "none" },
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
                      </TableCell>
                    </TableRow>
                  </TableBody>
                  {/* ))} */}
                </Table>
              </TableContainer>
              {/* note info */}
              <NoteInformation>
                {/* {paymentRequestGroupDetails.map((payment) => ( */}
                <TableContainer>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableBody>
                      <TableRow
                        sx={{
                          td: {
                            border: "1px solid var(--border-table)",
                            padding: 0,
                            paddingInline: 1,
                          },
                        }}
                      >
                        <TableCell sx={{ height: 1, width: "33.5%" }}>
                          <NoteInfo>
                            <Image src={categoryIcon} alt="" /> Category
                          </NoteInfo>
                        </TableCell>
                        <TableCell>
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
                              onChange={handleCategoryChange}
                              onBlur={() =>
                                handleUpdatePaymentRequest(payment.id)
                              }
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
                                "& fieldset": { border: "none" },
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
                                      index
                                    );
                                  }}
                                  sx={{
                                    "&:hover": {
                                      backgroundColor: "var(--hover-bg)",
                                    },
                                    "&.Mui-selected": {
                                      backgroundColor: "var(--hover-bg)",
                                    },
                                  }}
                                >
                                  {category.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </TableCell>
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
                    </TableBody>
                  </Table>
                </TableContainer>
                {/* ))} */}
              </NoteInformation>
            </React.Fragment>
          ))}
        </RequestDetails>
        {/* {paymentRequestDetails.status === 1 && (
              <PaymentStatus>
                <img src={statusIcon} alt="" />
                <p>Status: Rejected</p>
              </PaymentStatus>
            )} */}
      </WorkspaceItemDetailsLayout>
    </>
  );
};

export default PaymentRequestGroupDetails;

const RequestDetails = styled.div`
  padding-bottom: 50px;
`;
const PaymentStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 20px;
  img {
    width: 20px;
  }
  p {
    font-size: 20px;
  }
`;
