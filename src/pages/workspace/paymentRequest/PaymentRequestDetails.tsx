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
import { useCategoryProperty } from "../../../store/useCategoryProperty";
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
    console.log(selectedOptions, name, type);
    // const v = selectedOptions?.map((p) => p.value);
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

  const [age, setAge] = useState("Category");

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };
  // get the selected category list
  const [categoryProperties, setCategoryProperties] = useState<any>([]);

  const [selectedCategoryID, setSelectedCategoryID] = useState<
    number | undefined
  >(paymentRequestDetails?.category_id);
  const [selectedCategory, setSelectedCategory] = useState<any>({});
  useEffect(() => {
    setSelectedCategoryID(paymentRequestDetails.category_id);
  }, [setOpen]);
  useEffect(() => {
    const selectedCategory = workspaceCategoryProperties?.find(
      (f) => f?.ID === selectedCategoryID
    );
    if (selectedCategory) {
      setSelectedCategory(selectedCategory);
      setCategoryProperties(selectedCategory?.properties);
    } else {
      setSelectedCategory({});
      setCategoryProperties([]);
    }
  }, [selectedCategoryID, workspaceCategoryProperties]);

  // handle category
  const handleCategory = async (categoryId: number) => {
    setSelectedCategoryID(categoryId);
    setPropertyValues({});
    setPropertyMultiValues({});
    setPropertyTextValue({});
    setPropertyContent("");
    parseCategoryProperties = {};
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
      }
    });

    setPropertyMultiValues(initialSelectedValues);
    setPropertyValues(initialSelectSingleValue);
    setPropertyTextValue(initialPropertyTextValue);
  }, []);

  useEffect(() => {
    const initialSelectedCategory = workspaceCategoryProperties?.find(
      (f) => f?.ID === selectedCategoryID
    );
    setSelectedCategory(initialSelectedCategory);
    if (initialSelectedCategory) {
      setCategoryProperties(initialSelectedCategory?.properties);
    }
  }, []);

  // updating loading state
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleUpdateCategory = async () => {
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
              border: "1px solid var(--border-table)",
              borderRadius: "10px",
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
                        padding: 0,
                        paddingInline: 1,
                      },
                    }}
                  >
                    <TableCell
                      sx={{
                        height: 1,
                        width: 208,
                        borderRight: "1px solid var(--border-table)",
                      }}
                    >
                      <NoteInfo>
                        <Image src={categoryIcon} alt="" /> Category
                      </NoteInfo>
                    </TableCell>
                    <TableCell>
                      <FormControl
                        fullWidth
                        disabled={paymentRequestDetails?.status === 2}
                      >
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={age}
                          label="Age"
                          size="small"
                          onChange={handleCategoryChange}
                          onBlur={handleUpdateCategory}
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
                            {/* {paymentRequestDetails.category_name} */}
                            {selectedCategory?.name}
                          </MenuItem>
                          {workspaceCategoryProperties?.map((category) => (
                            <MenuItem
                              key={category.ID}
                              value={category.name}
                              // onBlur={handleUpdateCategory}
                              onClick={() => handleCategory(category.ID)}
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
          <Status>
            <p>Status</p>
            <StatusBtn>
              {getPaymentStatus(paymentRequestDetails.status)}
            </StatusBtn>
          </Status>
        </RequestDetails>
      </WorkspaceItemDetailsLayout>
    </>
  );
};

export default PaymentRequestDetails;

const RequestDetails = styled.div`
  /* padding-bottom: 50px; */
  margin: 30px;
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
export const SubmissionTime = styled.div`
  padding-top: 14px;
  p {
    font-size: 18px;
    padding-bottom: 6px;
  }
  div {
    border: 1px solid var(--border-table);
    padding: 10px 10px;
    border-radius: 8px;
  }
`;
export const Status = styled.div`
  padding-top: 14px;
  p {
    font-size: 18px;
    padding-bottom: 6px;
  }
`;
export const StatusBtn = styled.button`
  background: #7c7777;
  border: none;
  outline: none;
  padding: 8px 14px;
  font-size: 16px;
  border-radius: 7px;
  color: #ffffff;
`;
