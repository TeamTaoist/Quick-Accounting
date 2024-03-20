import { useParams } from "react-router-dom";
import WorkspaceItemDetailsLayout from "../../../components/layout/WorkspaceItemDetailsLayout";
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
  TableRow,
  TextField,
} from "@mui/material";

import arrowBottom from "../../../assets/workspace/arrow-bottom.svg";
import multiSelect from "../../../assets/workspace/multi-select.svg";
import selectIcon from "../../../assets/workspace/select.svg";
import categoryIcon from "../../../assets/workspace/category-icon.svg";
import optionsIcon from "../../../assets/workspace/option.svg";
import statusIcon from "../../../assets/workspace/status.svg";
import {
  Image,
  NoteHeader,
  NoteInfo,
  NoteInformation,
} from "../../workspaceDashboard/newPaymentRequest/newPaymentRequest.style";
import styled from "@emotion/styled";
import ReactSelect from "../../../components/ReactSelect";
import usePaymentsStore from "../../../store/usePayments";
import { useLoading } from "../../../store/useLoading";
import {
  CategoryProperties,
  useCategoryProperty,
} from "../../../store/useCategoryProperty";
import PaymentCurrencyTable from "../../../components/paymentRequestDetails/PaymentCurrencyTable";
import PaymentRequestCategoryProperties from "../../../components/paymentRequestDetails/PaymentRequestCategoryProperties";
import { useWorkspace } from "../../../store/useWorkspace";
import { getPaymentStatus } from "../../../utils/payment";
import { formatTimestamp } from "../../../utils/time";
import UpdateLoading from "../../../components/UpdateLoading";

interface PaymentRequestDetailsProps {
  setOpen: (open: boolean) => void;
  pageName?: string;
}
export interface ReactSelectOption {
  value: string;
  label: string;
}
interface PropertyValues {
  name?: string;
  type?: string;
  values?: string;
}
export class UpdateEvent extends Event {
  id: number;
  data: IPaymentRequest;
  constructor(type: string, data: { id: number; data: IPaymentRequest }) {
    super(type);
    this.id = data.id;
    this.data = data.data;
  }
}
const PaymentRequestDetails = ({
  setOpen,
  pageName,
}: PaymentRequestDetailsProps) => {
  const { id } = useParams();

  const [selectedValue, setSelectedValue] = useState("Option1");

  const {
    getPaymentRequestList,
    updatePaymentRequestCategory,
    paymentRequestDetails,
  } = usePaymentsStore();
  const { workspaceCategoryProperties } = useCategoryProperty();
  const { userWorkspaces } = useWorkspace();
  const { isLoading } = useLoading();

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedValue(event.target.value);
  };

  // handle react select
  const [selectedValues, setSelectedValues] = useState<ReactSelectOption[]>([]);
  const [selectSingleValue, setSelectSingleValue] =
    useState<ReactSelectOption>();
  const [propertyValues, setPropertyValues] = useState<{
    [key: string]: PropertyValues;
  }>({});
  const [propertyMultiValues, setPropertyMultiValues] = useState<{
    [key: string]: PropertyValues;
  }>({});

  const handleSelectChange = (
    selectedOptions: ReactSelectOption[],
    name: string,
    type: string
  ) => {
    setSelectedValues(selectedOptions);
    setPropertyMultiValues({
      ...propertyMultiValues,
      [name]: {
        name: name,
        type: type,
        values: selectedOptions.map((option) => option.value).join(";"),
      },
    });
  };

  const handleSelectSingleChange = (
    selectedOption: ReactSelectOption,
    name: string,
    type: string
  ) => {
    setSelectSingleValue(selectedOption);
    setPropertyValues({
      ...propertyValues,
      [name]: {
        name: name,
        type: type,
        values: selectedOption.value,
      },
    });
  };
  // const handleSelectSingleChange = (
  //   selectedOption: ReactSelectOption,
  //   property: PropertyValues
  // ) => {
  //   setSelectSingleValue(selectedOption);
  //   if (property && property.name) {
  //     setPropertyValues({
  //       ...propertyValues,
  //       [property?.name]: {
  //         name: property.name,
  //         type: property.type,
  //         values: selectedOption.value,
  //       },
  //     });
  //   }
  // };

  // property value input
  const [propertyContent, setPropertyContent] = useState<string>("");
  const [proPertyTextValue, setPropertyTextValue] = useState<{
    [name: string]: any;
  }>({});

  const handlePropertyText = (e: any, name: string, type: string) => {
    const value = e.target.value;
    setPropertyTextValue({
      ...proPertyTextValue,
      [name]: {
        ...proPertyTextValue[name],
        values: value,
      },
    });
  };
  // date picker
  const [datePicker, setDatePicker] = useState<{
    [name: string]: any;
  }>({});

  const handleDatePickerProperty = (e: any, name: string) => {
    const value = e.target.value;
    setDatePicker({
      ...datePicker,
      [name]: {
        ...datePicker[name],
        values: value,
      },
    });
  };

  const [selectedCategoryID, setSelectedCategoryID] = useState<
    number | undefined
  >(paymentRequestDetails?.category_id);
  const [selectedCategory, setSelectedCategory] = useState<any>({});
  useEffect(() => {
    setSelectedCategoryID(paymentRequestDetails.category_id);
  }, [setOpen, paymentRequestDetails.category_id]);
  useEffect(() => {
    const selectedCategory = workspaceCategoryProperties?.find(
      (f) => f?.ID === selectedCategoryID
    );
    if (selectedCategory) {
      setSelectedCategory(selectedCategory);
    } else {
      setSelectedCategory({});
    }
  }, [selectedCategoryID, workspaceCategoryProperties]);

  // handle category
  const handleCategory = async (category: CategoryProperties) => {
    setSelectedCategoryID(category.ID);
    setPropertyValues({});
    setPropertyMultiValues({});
    setPropertyTextValue({});
    setPropertyContent("");
    parseCategoryProperties = {};
    setDatePicker({});
    const updatedPaymentBody = {
      category_id: category.ID,
      category_name: category.name,
      category_properties: [],
    };
    setIsUpdating(true);
    await updatePaymentRequestCategory(
      id,
      paymentRequestDetails?.ID.toString(),
      updatedPaymentBody
    ).then((res) => {
      if (res) {
        setIsUpdating(false);
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);
      }
    });
  };
  // form data
  const updatedPaymentBody = {
    category_id: selectedCategory?.ID,
    category_name: selectedCategory?.name,
    category_properties: [
      ...Object.keys(propertyValues).map(
        (key) =>
          ({
            name: key as string,
            type: "single-select",
            values: propertyValues[key as keyof PropertyValues]?.values,
          } as ICategoryProperties)
      ),
      ...Object.keys(propertyMultiValues).map(
        (key) =>
          ({
            name: key as string,
            type: "multi-select",
            values: propertyMultiValues[key as keyof PropertyValues]?.values,
          } as ICategoryProperties)
      ),
      ...Object.keys(proPertyTextValue).map(
        (key) =>
          ({
            name: key,
            type: "Text",
            values: proPertyTextValue[key].values,
          } as ICategoryProperties)
      ),
      ...Object.keys(datePicker).map(
        (key) =>
          ({
            name: key,
            type: "date-picker",
            values: datePicker[key].values,
          } as ICategoryProperties)
      ),
    ],
  };

  let parseCategoryProperties: any;
  if (paymentRequestDetails) {
    const categoryProperties = paymentRequestDetails?.category_properties;
    if (categoryProperties) {
      parseCategoryProperties = JSON.parse(categoryProperties);
    }
  }

  // new
  useEffect(() => {
    const initialSelectSingleValue: { [name: string]: any } = {};
    const initialSelectedValues: { [name: string]: any } = {};
    const initialPropertyTextValue: { [name: string]: any } = {};
    const initialPropertyDateValue: { [name: string]: any } = {};

    parseCategoryProperties?.forEach((property: any) => {
      if (property.type === "single-select") {
        initialSelectSingleValue[property.name] = {
          name: property.name,
          type: property.type,
          values: property.values,
        };
      } else if (property.type === "multi-select") {
        initialSelectedValues[property.name] = {
          name: property.name,
          type: property.type,
          values: property.values,
        };
      } else if (property.type === "Text") {
        initialPropertyTextValue[property.name] = {
          name: property.name,
          type: property.type,
          values: property.values,
        };
      } else if (property.type === "date-picker") {
        initialPropertyDateValue[property.name] = {
          name: property.name,
          type: property.type,
          values: property.values,
        };
      }
    });

    setPropertyMultiValues(initialSelectedValues);
    setPropertyValues(initialSelectSingleValue);
    setPropertyTextValue(initialPropertyTextValue);
    setDatePicker(initialPropertyDateValue);
  }, []);

  // updating loading state
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleUpdateCategory = async (category?: any) => {
    setIsUpdating(true);
    await updatePaymentRequestCategory(
      id,
      paymentRequestDetails?.ID.toString(),
      updatedPaymentBody
    ).then((res) => {
      if (res) {
        setIsUpdating(false);
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);
      }
    });
    // if (pageName === "payment-request") {
    //   // getPaymentRequestList(paymentRequestDetails.workspace_id, false);
    // }
    if (pageName === "queue") {
      const category_properties = JSON.stringify(
        updatedPaymentBody.category_properties
      );
      const event = new UpdateEvent("updatePaymentRequest", {
        id: paymentRequestDetails?.ID,
        data: {
          ...paymentRequestDetails,
          ...updatedPaymentBody,
          category_properties,
        },
      });
      document.dispatchEvent(event);
    }
  };
  const [selectedWorkspaceName, setSelectedWorkspaceName] =
    useState<string>("");
  const [selectedWorkspaceAvatar, setSelectedWorkspaceAvatar] =
    useState<string>("");
  const [selectedWorkspaceSafeAddress, setSelectedWorkspaceSafeAddress] =
    useState<string>("");
  const selectedWorkspace = userWorkspaces.data.rows.find(
    (workspace) => workspace.ID === paymentRequestDetails.workspace_id
  );
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
          <TableContainer
            sx={{
              boxShadow: "none",
              border: "1px solid var(--clr-gray-200)",
              borderRadius: "6px",
            }}
          >
            <PaymentCurrencyTable />
            {/* note info */}
            <NoteInformation>
              <NoteHeader>
                <h3>Note Information</h3>
                <UpdateLoading isUpdating={isUpdating} isSuccess={isSuccess} />
              </NoteHeader>
              {/* <TableContainer> */}
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableBody>
                  <TableRow
                    sx={{
                      td: {
                        // border: "1px solid var(--border-table)",
                        padding: "6px",
                        paddingInline: 2,
                      },
                    }}
                  >
                    <TableCell
                      sx={{
                        height: 1,
                        width: 208,
                        fontSize: "16px",
                        fontWeight: "500",
                        borderBottom: "none",
                        borderTop: "1px solid var(--clr-gray-200)",
                        fontFamily: "Inter",
                      }}
                    >
                      <NoteInfo>
                        <Image src={categoryIcon} alt="" /> Category
                      </NoteInfo>
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: "none",
                        borderTop: "1px solid var(--clr-gray-200)",
                      }}
                    >
                      <FormControl
                        fullWidth
                        disabled={paymentRequestDetails?.status === 2}
                      >
                        {/* <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={paymentRequestDetails?.category_name}
                          label="Age"
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
                            "& fieldset": { border: "none" },
                          }}
                        >
                          <MenuItem disabled value="Category">
                            {selectedCategory?.name}
                          </MenuItem>
                          {workspaceCategoryProperties?.map((category) => (
                            <MenuItem
                              key={category.ID}
                              value={category.name}
                              // onBlur={handleUpdateCategory}
                              onClick={() => handleCategory(category)}
                            >
                              {category.name}
                            </MenuItem>
                          ))}
                        </Select> */}
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={paymentRequestDetails?.category_name}
                          label="Age"
                          // onChange={handleCategoryChange}
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
                          // sx={{
                          //   minWidth: "100%",
                          //   "& fieldset": { border: "none" },
                          // }}
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
                            Category name
                          </MenuItem>
                          {workspaceCategoryProperties?.map((category) => (
                            <MenuItem
                              key={category.ID}
                              value={category.name}
                              // onBlur={handleUpdateCategory}
                              onClick={() => handleCategory(category)}
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
                    </TableCell>
                  </TableRow>
                  {selectedCategory && (
                    <>
                      <PaymentRequestCategoryProperties
                        selectedCategory={selectedCategory}
                        handleUpdateCategory={handleUpdateCategory}
                        selectSingleValue={selectSingleValue}
                        handleSelectSingleChange={handleSelectSingleChange}
                        parseCategoryProperties={parseCategoryProperties}
                        selectedValues={selectedValues}
                        handleSelectChange={handleSelectChange}
                        proPertyTextValue={proPertyTextValue}
                        handlePropertyText={handlePropertyText}
                        status={paymentRequestDetails.status}
                        datePicker={datePicker}
                        handleDatePickerProperty={handleDatePickerProperty}
                      />
                    </>
                  )}
                </TableBody>
              </Table>
              {/* </TableContainer> */}
              {/* rejected status */}
              {/* {paymentRequestDetails?.status === 2 && (
                <PaymentStatus>
                  <img src={statusIcon} alt="" />
                  <p>Status: Rejected</p>
                </PaymentStatus>
              )} */}
            </NoteInformation>
          </TableContainer>
          {/* submission time */}
          <SubmissionTime>
            <p>Submission time</p>
            <div>{formatTimestamp(paymentRequestDetails.submit_ts)}</div>
          </SubmissionTime>
          <Status status={getPaymentStatus(paymentRequestDetails.status)}>
            <h6>Status</h6>
            <div>
              <p></p>
              {getPaymentStatus(paymentRequestDetails.status)}
            </div>
          </Status>
        </RequestDetails>
      </WorkspaceItemDetailsLayout>
    </>
  );
};

export default PaymentRequestDetails;

const RequestDetails = styled.div`
  /* padding-bottom: 50px; */
  margin: 30px 40px;
`;
export const SubmissionTime = styled.div`
  padding-top: 18px;
  p {
    font-size: 14px;
    font-weight: 500;
    padding-bottom: 8px;
  }
  div {
    border: 1px solid var(--clr-gray-200);
    padding: 10px 10px;
    font-size: 14px;
    border-radius: 8px;
  }
`;
export const Status = styled.div<any>`
  padding-top: 14px;
  h6 {
    font-size: 14px;
    font-weight: 500;
    padding-bottom: 8px;
  }
  div {
    display: flex;
    align-items: center;
    gap: 5px;
    p {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: ${({ status }) => {
        switch (status) {
          case "Submitted":
            return "#16A34A";
          case "Rejected":
            return "#FACC15";
          case "Pending":
            return "#94A3B8";
          case "Failed":
            return "#DC2626";
          case "Executed":
            return "#2563EB";
          default:
            return "gray";
        }
      }};
    }
    img {
      width: 7px;
    }
  }
`;
export const StatusBtn = styled.button`
  background: transparent;
  border: none;
  outline: none;
  padding: 8px 14px;
  font-size: 16px;
`;
