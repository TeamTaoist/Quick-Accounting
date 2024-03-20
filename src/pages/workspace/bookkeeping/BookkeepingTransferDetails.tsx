import { useParams } from "react-router-dom";
import Header from "../../../components/layout/header/Header";
import WorkspaceItemDetailsLayout from "../../../components/layout/WorkspaceItemDetailsLayout";
import { useEffect, useState } from "react";
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
} from "@mui/material";

import arrowBottom from "../../../assets/workspace/arrow-bottom.svg";
import multiSelect from "../../../assets/workspace/multi-select.svg";
import selectIcon from "../../../assets/workspace/select.svg";
import categoryIcon from "../../../assets/workspace/category-icon.svg";
import optionsIcon from "../../../assets/workspace/option.svg";
import linkIcon from "../../../assets/workspace/link-icon.svg";
import transferArrow from "../../../assets/workspace/transfer-arrow.svg";
import {
  DeleteIcon,
  Image,
  NoteHeader,
  NoteInfo,
  NoteInformation,
  RequestSubmit,
} from "../../workspaceDashboard/newPaymentRequest/newPaymentRequest.style";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

import ReactSelect from "../../../components/ReactSelect";
import data from "../../../data/tableData";
import usePaymentsStore from "../../../store/usePayments";
import { useLoading } from "../../../store/useLoading";
import CHAINS from "../../../utils/chain";
import { useWorkspace } from "../../../store/useWorkspace";
import { formatNumber } from "../../../utils/number";
import { getShortAddress } from "../../../utils";
import {
  CategoryProperties,
  useCategoryProperty,
} from "../../../store/useCategoryProperty";
import { useBookkeeping } from "../../../store/useBookkeeping";
import PaymentRequestCategoryProperties from "../../../components/paymentRequestDetails/PaymentRequestCategoryProperties";
import { formatTimestamp } from "../../../utils/time";
import {
  Status,
  StatusBtn,
  SubmissionTime,
} from "../paymentRequest/PaymentRequestDetails";
import { getPaymentStatus } from "../../../utils/payment";
import { useDomainStore } from "../../../store/useDomain";
import UpdateLoading from "../../../components/UpdateLoading";

const HeaderStyles = {
  padding: "10px 15px",
  fontFamily: "Inter",
  fontSize: "16px",
  fontWeight: "500",
  color: "#0F172A",
  width: "33%",
};
interface PaymentRequestDetailsProps {
  setOpen: (open: boolean) => void;
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

const BookkeepingTransferDetails = ({
  setOpen,
}: PaymentRequestDetailsProps) => {
  const { id } = useParams();

  const { formatAddressToDomain } = useDomainStore();

  const { workspace, userWorkspaces } = useWorkspace();
  const chainData = CHAINS.find(
    (chain) => chain.chainId === workspace?.chain_id
  );

  const { updatePaymentRequestCategory } = usePaymentsStore();
  const { bookkeepingDetails, getBookkeepingList, updateBookkeepingCategory } =
    useBookkeeping();
  const { workspaceCategoryProperties } = useCategoryProperty();
  const { isLoading } = useLoading();

  const [selectedValue, setSelectedValue] = useState("Option1");

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
    const v = selectedOptions?.map((p) => p.value);
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

  // get the selected category list
  const [selectedCategoryID, setSelectedCategoryID] = useState<number>(
    bookkeepingDetails?.category_id
  );
  const [selectedCategory, setSelectedCategory] = useState<any>({});
  useEffect(() => {
    setSelectedCategoryID(bookkeepingDetails.category_id);
  }, [setOpen]);
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

  const handleCategory = async (category: CategoryProperties) => {
    setSelectedCategoryID(category.ID);
    setPropertyValues({});
    setPropertyMultiValues({});
    setPropertyTextValue({});
    setPropertyContent("");
    setDatePicker({});
    const updatedPaymentBody = {
      category_id: category.ID,
      category_name: category.name,
      category_properties: [],
    };
    setIsUpdating(true);
    await updateBookkeepingCategory(
      id,
      bookkeepingDetails.ID.toString(),
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
  // if (paymentRequestDetails) {
  if (bookkeepingDetails.category_properties !== "") {
    const categoryProperties = bookkeepingDetails?.category_properties;
    if (categoryProperties) {
      parseCategoryProperties = JSON.parse(categoryProperties);
    }
  }
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
        // initialSelectSingleValue[property.name] = property.values;
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

  const handleUpdateCategory = async () => {
    setIsUpdating(true);
    await updateBookkeepingCategory(
      id,
      bookkeepingDetails.ID.toString(),
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

  return (
    // <Header>
    <WorkspaceItemDetailsLayout
      title="Transaction Detail"
      setOpen={setOpen}
      workspaceName={workspace.name}
      workspaceAvatar={workspace.avatar}
      address={workspace.vault_wallet}
    >
      <RequestDetails>
        <TransferTable>
          <TableContainer
            // component={Paper}
            // sx={{ boxShadow: "none", border: "1px solid var(--border)" }}
            // sx={{ boxShadow: "none" }}
            sx={{
              boxShadow: "none",
              border: "1px solid var(--clr-gray-200)",
              borderRadius: "6px",
            }}
          >
            <Table>
              <TableHead
                sx={{ backgroundColor: "var(--clr-gray-200)", height: "56px" }}
              >
                <TableRow>
                  <TableCell sx={HeaderStyles}>Safe</TableCell>
                  <TableCell sx={HeaderStyles}>Counterparty</TableCell>
                  <TableCell sx={HeaderStyles}>Amount</TableCell>
                  <TableCell sx={HeaderStyles}>Currency</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <SafeSection>
                      <div>{getShortAddress(workspace.vault_wallet)}</div>
                      <Logo $dir={bookkeepingDetails.direction}>
                        <img src={transferArrow} alt="" />
                      </Logo>
                    </SafeSection>
                  </TableCell>
                  <TableCell>
                    {formatAddressToDomain(
                      bookkeepingDetails.counterparty,
                      workspace.chain_id,
                      workspace.name_service === "sns"
                    )}
                  </TableCell>
                  <TableCell>
                    {formatNumber(Number(bookkeepingDetails.amount))}
                  </TableCell>
                  <TableCell>{bookkeepingDetails.currency_name}</TableCell>
                </TableRow>
                {/* ))} */}
              </TableBody>
            </Table>
            {/* </TableContainer>
        </TransferTable> */}
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
                        padding: "6px",
                        paddingInline: 2,
                      },
                    }}
                  >
                    <TableCell
                      sx={{
                        height: 1,
                        width: 200,
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
                    <TableCell>
                      <FormControl
                        fullWidth
                        disabled={bookkeepingDetails?.status === 2}
                      >
                        {/* <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={bookkeepingDetails?.category_name}
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
                          value={bookkeepingDetails?.category_name}
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
                        status={bookkeepingDetails.status}
                        datePicker={datePicker}
                        handleDatePickerProperty={handleDatePickerProperty}
                      />
                    </>
                  )}
                </TableBody>
              </Table>
              {/* </TableContainer> */}
            </NoteInformation>
            {/* <ReactSelect /> */}
          </TableContainer>
          {/* submission time */}
          <SubmissionTime>
            <p>Submission time</p>
            <div>{formatTimestamp(bookkeepingDetails.submit_ts)}</div>
          </SubmissionTime>
          <SubmissionTime>
            <p>Execution time</p>
            <div>{formatTimestamp(bookkeepingDetails.execute_ts)}</div>
          </SubmissionTime>
          <TransactionHash>
            <p>Transaction hash</p>
            <div>
              <span>{bookkeepingDetails.tx_hash}</span>
              <a
                href={`${chainData?.explore}/tx/${bookkeepingDetails.tx_hash}`}
                target="_blank"
                rel="noreferrer"
              >
                {/* <img src={linkIcon} alt="" /> */}
              </a>
            </div>
          </TransactionHash>
          <Status status={getPaymentStatus(bookkeepingDetails.status)}>
            <h6>Status</h6>
            <div>
              <p></p>
              {getPaymentStatus(bookkeepingDetails.status)}
            </div>
          </Status>
        </TransferTable>
      </RequestDetails>
    </WorkspaceItemDetailsLayout>
    // </Header>
  );
};

export default BookkeepingTransferDetails;

const RequestDetails = styled.div`
  /* margin: 30px; */
  padding-bottom: 30px;
`;
const TransferTable = styled.div`
  /* padding-bottom: 50px; */
  margin-inline: 40px;
  margin-top: 20px;
`;
const TransactionHash = styled(SubmissionTime)`
  div {
    color: #888;
    display: flex;
    justify-content: space-between;
    align-items: center;
    p {
      color: var(--text-secondary);
      font-size: 16px;
    }
    img {
      width: 22px;
    }
  }
`;
export const SafeSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* height: 100%; */
`;

const LeftDirStyle = css`
  transform: rotate(180deg);
`;

export const Logo = styled.div<{ $dir?: string }>`
  /* flex: 0 0 30%; */
  /* height: 44px; */
  img {
    /* width: 20px; */
    /* height: 100%; */
    ${({ $dir }) => $dir === "i" && LeftDirStyle}
  }
`;
