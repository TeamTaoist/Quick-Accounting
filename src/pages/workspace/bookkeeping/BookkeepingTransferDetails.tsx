import { useParams } from "react-router-dom";
import Header from "../../../components/layout/header/Header";
import WorkspaceItemDetailsLayout from "../../../components/layout/WorkspaceItemDetailsLayout";
import { useEffect, useState } from "react";
import {
  FormControl,
  InputAdornment,
  MenuItem,
  Paper,
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
  NoteInfo,
  NoteInformation,
  RequestSubmit,
} from "../../workspaceDashboard/newPaymentRequest/newPaymentRequest.style";
import styled from "@emotion/styled";
import ReactSelect from "../../../components/ReactSelect";
import data from "../../../data/tableData";
import usePaymentsStore from "../../../store/usePayments";
import { useLoading } from "../../../store/useLoading";
import CHAINS from "../../../utils/chain";
import { useWorkspace } from "../../../store/useWorkspace";
import { formatNumber } from "../../../utils/number";
import { getShortAddress } from "../../../utils";
import { useCategoryProperty } from "../../../store/useCategoryProperty";
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

const BookkeepingTransferDetails = ({ setOpen }: any) => {
  const { id } = useParams();

  const { workspace } = useWorkspace();
  const chainData = CHAINS.find(
    (chain) => chain.chainId === workspace?.chain_id
  );

  const { paymentRequestDetails, updatePaymentRequestCategory } =
    usePaymentsStore();
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
  const [propertyValues, setPropertyValues] = useState<PropertyValues>({});
  const [propertyMultiValues, setPropertyMultiValues] =
    useState<PropertyValues>({});

  const handleSelectSingleChange = (
    selectedOption: ReactSelectOption,
    name: string,
    type: string
  ) => {
    setSelectSingleValue(selectedOption);
    setPropertyValues({ name: name, type: type, values: selectedOption.value });
    if (selectedOption.value === "") {
      setPropertyMultiValues({});
    }
  };

  // handle multi select
  const handleSelectChange = (
    selectedOptions: ReactSelectOption[],
    name: string,
    type: string
  ) => {
    setSelectedValues(selectedOptions);
    console.log(selectedOptions, name, type);
    const v = selectedOptions?.map((p) => p.value);
    setPropertyMultiValues({
      name: name,
      type: type,
      values: v.join(";"),
    });
    if (v.length === 0) {
      setPropertyMultiValues({});
    }
  };

  // property value input
  const [propertyContent, setPropertyContent] = useState<string>("");
  const [proPertyTextValue, setPropertyTextValue] = useState<any>({});
  const handlePropertyText = (e: any, name: string, type: string) => {
    setPropertyContent(e.target.value);
    setPropertyTextValue({
      name: name,
      type: type,
      values: e.target.value,
    });
    if (e.target.value === "") {
      setPropertyTextValue({});
    }
  };

  const [age, setAge] = useState("Category");

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  // const handleSelectChange = (selectedOptions: any) => {
  //   setSelectedValues(selectedOptions);
  // };

  // get the selected category list
  const [categoryProperties, setCategoryProperties] = useState<any>([]);

  const [selectedCategoryID, setSelectedCategoryID] = useState<number>(
    paymentRequestDetails?.category_id
  );
  const [selectedCategory, setSelectedCategory] = useState<any>({});
  useEffect(() => {
    setSelectedCategoryID(paymentRequestDetails.category_id);
  }, [setOpen]);
  useEffect(() => {
    const selectedCategory = workspaceCategoryProperties?.find(
      (f) => f?.ID === selectedCategoryID
    );
    setSelectedCategory(selectedCategory);
    if (selectedCategory) {
      setCategoryProperties(selectedCategory?.properties);
    }
  }, [selectedCategoryID, workspaceCategoryProperties]);

  console.log("selected category ", selectedCategory);
  const handleCategory = async (categoryId: number) => {
    setSelectedCategoryID(categoryId);
    setPropertyValues({});
    setPropertyMultiValues({});
    setPropertyTextValue({});
    setPropertyContent("");
  };
  // form data
  const updatedPaymentBody = {
    category_id: selectedCategory?.ID,
    category_name: selectedCategory?.name,
    category_properties: [
      ...(Object.keys(propertyValues).length !== 0 ? [propertyValues] : []),
      ...(Object.keys(propertyMultiValues).length !== 0
        ? [propertyMultiValues]
        : []),
      ...(Object.keys(proPertyTextValue).length !== 0
        ? [proPertyTextValue]
        : []),
    ],
  };
  let parseCategoryProperties: any;
  // if (paymentRequestDetails) {
  if (paymentRequestDetails.category_properties !== "") {
    const categoryProperties = paymentRequestDetails?.category_properties;
    if (categoryProperties) {
      parseCategoryProperties = JSON.parse(categoryProperties);
    }
  }
  useEffect(() => {
    const initialSelectSingleValue = parseCategoryProperties
      .filter((p: any) => p.type === "single-select")
      .map((p: any) => ({
        name: p.name,
        type: p.type,
        values: p.values,
      }));

    const initialSelectedValues = parseCategoryProperties
      .filter((p: any) => p.type === "multi-select")
      .map((p: any) => ({
        name: p.name,
        type: p.type,
        values: p.values,
      }));

    const initialPropertyTextValue = parseCategoryProperties
      .filter((p: any) => p.type === "Text")
      .map((p: any) => ({
        name: p.name,
        type: p.type,
        values: p.values,
      }));
    const initialText = parseCategoryProperties
      .filter((p: any) => p.type === "Text")
      .map((p: any) => p.values);

    setPropertyTextValue(initialPropertyTextValue[0] || {});
    setPropertyMultiValues(initialSelectedValues[0] || {});
    setPropertyValues(initialSelectSingleValue[0] || {});

    setPropertyContent(initialText[0]);
  }, []);

  const handleUpdateCategory = async () => {
    await updatePaymentRequestCategory(
      id,
      paymentRequestDetails.payment_request_id.toString(),
      updatedPaymentBody
    );
  };
  if (isLoading) return <p></p>;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZoneName: "short",
    };

    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      date
    );
    return formattedDate + " +UTC";
  };
  return (
    // <Header>
    <WorkspaceItemDetailsLayout title="Transfer Detail" setOpen={setOpen}>
      <RequestDetails>
        <TransferTable>
          <TableContainer
            // component={Paper}
            // sx={{ boxShadow: "none", border: "1px solid var(--border)" }}
            sx={{ boxShadow: "none" }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Safe</TableCell>
                  <TableCell>Counterparty</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Currency</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* {data.slice(0, 1).map((row) => ( */}
                <TableRow>
                  <TableCell
                    sx={{
                      borderRight: "1px solid var(--border-table)",
                      borderLeft: "1px solid var(--border-table)",
                      borderBottom: "1px solid var(--border-table)",
                      // borderRadius: "7px",
                      padding: 0,
                      paddingLeft: "12px",
                    }}
                  >
                    <SafeSection>
                      <div>{getShortAddress(workspace.vault_wallet)}</div>
                      <Logo>
                        <img src={transferArrow} alt="" />
                      </Logo>
                    </SafeSection>
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid var(--border-table)",
                      borderBottom: "1px solid var(--border-table)",
                      // borderRadius: "7px",
                      padding: 0,
                      paddingLeft: "12px",
                    }}
                  >
                    {getShortAddress(paymentRequestDetails.recipient)}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid var(--border-table)",
                      borderBottom: "1px solid var(--border-table)",
                      // borderRadius: "7px",
                      padding: 0,
                      paddingLeft: "12px",
                    }}
                  >
                    {formatNumber(Number(paymentRequestDetails.amount))}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderBottom: "1px solid var(--border-table)",
                      borderRight: "1px solid var(--border-table)",
                      // borderRadius: "7px",
                      padding: 0,
                      paddingLeft: "12px",
                    }}
                  >
                    {paymentRequestDetails.currency_name}
                  </TableCell>
                </TableRow>
                {/* ))} */}
              </TableBody>
            </Table>
          </TableContainer>
        </TransferTable>
        {/* Transaction hash */}
        <TransactionHash>
          <h3>Transaction hash</h3>
          <div>
            <p>{paymentRequestDetails.tx_hash}</p>
            <a
              href={`${chainData?.explore}/tx/${paymentRequestDetails.tx_hash}`}
              target="_blank"
              rel="noreferrer"
            >
              <img src={linkIcon} alt="" />
            </a>
          </div>
        </TransactionHash>
        <TransactionHash>
          <h3>Transaction date</h3>
          <div>
            {/* <p>Oct-15-2023 01:04:34 PM +UTC</p> */}
            <p>{formatTimestamp(paymentRequestDetails.UpdatedAt)}</p>
          </div>
        </TransactionHash>
        {/* note info */}
        <NoteInformation>
          <h3>Note Information</h3>

          <TableContainer sx={{ borderRadius: "7px" }}>
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
                  <TableCell sx={{ height: 1, width: 200 }}>
                    <NoteInfo>
                      <Image src={categoryIcon} alt="" /> Category
                    </NoteInfo>
                  </TableCell>
                  <TableCell>
                    <FormControl
                      fullWidth
                      disabled={paymentRequestDetails.status === 2}
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
                        {workspaceCategoryProperties.map((category) => (
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
                {categoryProperties?.map((property: any) => (
                  <>
                    {property.type === "single-select" && (
                      <TableRow
                        sx={{
                          td: {
                            border: "1px solid var(--border-table)",
                            padding: 1,
                            paddingInline: 1,
                          },
                        }}
                      >
                        <TableCell sx={{ height: 1, width: 200 }}>
                          <NoteInfo>
                            <Image src={selectIcon} alt="" /> {property.name}
                          </NoteInfo>
                        </TableCell>
                        <TableCell onBlur={handleUpdateCategory}>
                          <ReactSelect
                            isMulti={false}
                            isDisabled={paymentRequestDetails.status === 2}
                            value={selectSingleValue}
                            onChange={(selectedOption: ReactSelectOption) =>
                              handleSelectSingleChange(
                                selectedOption,
                                property.name,
                                property.type
                              )
                            }
                            options={property.values
                              .split(";")
                              .map((v: string) => ({
                                value: v,
                                label: v,
                              }))}
                            defaultValues={parseCategoryProperties
                              .filter((p: any) => p.type === "single-select")
                              .map((p: any) =>
                                p.values.split(";").map((v: string) => ({
                                  value: v,
                                  label: v,
                                }))
                              )
                              .flat()}
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
                {categoryProperties?.map((property: any) => (
                  <>
                    {property.type === "multi-select" && (
                      <TableRow
                        sx={{
                          td: {
                            border: "1px solid var(--border-table)",
                            padding: 1,
                            paddingInline: 1,
                          },
                        }}
                      >
                        <TableCell sx={{ height: 1, width: 200 }}>
                          <NoteInfo>
                            <Image src={multiSelect} alt="" /> {property.name}
                          </NoteInfo>
                        </TableCell>

                        <TableCell onBlur={handleUpdateCategory}>
                          <ReactSelect
                            isDisabled={paymentRequestDetails.status === 2}
                            value={selectedValues}
                            onChange={(selectedOptions: ReactSelectOption[]) =>
                              handleSelectChange(
                                selectedOptions,
                                property.name,
                                property.type
                              )
                            }
                            options={property.values
                              .split(";")
                              .map((v: string) => ({
                                value: v,
                                label: v,
                              }))}
                            // defaultValues={property.values
                            //   .split(";")
                            //   .map((v: string) => ({
                            //     value: v,
                            //     label: v,
                            //   }))}
                            defaultValues={parseCategoryProperties
                              .filter((p: any) => p.type === "multi-select")
                              .map((p: any) =>
                                p.values.split(";").map((v: string) => ({
                                  value: v,
                                  label: v,
                                }))
                              )
                              .flat()}
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
                {categoryProperties?.map((property: any) => (
                  <>
                    {property.type === "Text" && (
                      <TableRow
                        sx={{
                          td: {
                            border: "1px solid var(--border-table)",
                            padding: 1,
                            paddingInline: 1,
                          },
                        }}
                      >
                        <TableCell sx={{ height: 1, width: 200 }}>
                          <NoteInfo>
                            <Image src={optionsIcon} alt="" /> {property.name}
                          </NoteInfo>
                        </TableCell>

                        <TableCell onBlur={handleUpdateCategory}>
                          <TextField
                            disabled={paymentRequestDetails.status === 2}
                            sx={{
                              "& fieldset": { border: "none" },
                            }}
                            size="small"
                            fullWidth
                            value={propertyContent}
                            // id="fullWidth"
                            placeholder="Enter content"
                            onChange={(e) =>
                              handlePropertyText(
                                e,
                                property.name,
                                property.type
                              )
                            }
                            InputProps={{
                              style: { padding: 0 },
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </NoteInformation>
        {/* <ReactSelect /> */}
      </RequestDetails>
    </WorkspaceItemDetailsLayout>
    // </Header>
  );
};

export default BookkeepingTransferDetails;

const RequestDetails = styled.div`
  padding-bottom: 50px;
`;
const TransferTable = styled.div`
  /* padding-bottom: 50px; */
  margin-inline: 46px;
  margin-top: 20px;
`;
const TransactionHash = styled.div`
  margin-inline: 46px;
  margin-top: 30px;
  img {
    cursor: pointer;
  }
  h3 {
    font-size: 18px;
    padding-bottom: 8px;
    font-weight: 400;
  }
  div {
    border: 1px solid var(--border-table);
    padding: 10px 14px;
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
export const Logo = styled.div`
  /* flex: 0 0 30%; */
  /* height: 44px; */
  img {
    /* width: 20px; */
    /* height: 100%; */
  }
`;
