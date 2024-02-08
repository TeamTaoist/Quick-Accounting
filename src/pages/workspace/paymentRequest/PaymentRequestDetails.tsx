import { useParams } from "react-router-dom";
import Header from "../../../components/layout/header/Header";
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
import {
  DeleteIcon,
  Image,
  NoteInfo,
  NoteInformation,
  RequestSubmit,
} from "../../workspaceDashboard/newPaymentRequest/newPaymentRequest.style";
import styled from "@emotion/styled";
import ReactSelect from "../../../components/ReactSelect";
import usePaymentsStore from "../../../store/usePayments";
import { useLoading } from "../../../store/useLoading";
import Loading from "../../../utils/Loading";
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
const PaymentRequestDetails = ({ setOpen }: PaymentRequestDetailsProps) => {
  const { id } = useParams();

  const [selectedValue, setSelectedValue] = useState("Option1");

  const { paymentRequestDetails, updatePaymentRequestCategory } =
    usePaymentsStore();
  const { workspaceCategoryProperties } = useCategoryProperty();
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
  // const [proPertyTextValue, setPropertyTextValue] = useState<any>({});
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
  // handle category
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
  console.log("property", categoryProperties);
  // new
  useEffect(() => {
    const initialSelectSingleValue: { [name: string]: any } = {};
    const initialSelectedValues: { [name: string]: any } = {};
    const initialPropertyTextValue: { [name: string]: any } = {};
    const initialText: { [name: string]: any } = {};

    parseCategoryProperties.forEach((property: any) => {
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
        // initialText[property.name] = property.values;
      }
    });

    // setPropertyTextValue(initialPropertyTextValue);
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

  const handleUpdateCategory = async () => {
    await updatePaymentRequestCategory(
      id,
      paymentRequestDetails.ID.toString(),
      updatedPaymentBody
    );
  };
  console.log(updatedPaymentBody);

  if (isLoading) return <p></p>;

  return (
    <>
      <WorkspaceItemDetailsLayout
        title="Payment request details"
        setOpen={setOpen}
      >
        <RequestDetails>
          <TableContainer sx={{ paddingInline: "40px", paddingTop: "30px" }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      width: 200,
                      border: 0,
                      paddingInline: 0,
                    }}
                  >
                    Recipient
                  </TableCell>
                  <TableCell sx={{ width: 150, border: 0, paddingInline: 0 }}>
                    Amount
                  </TableCell>
                  <TableCell sx={{ width: 200, border: 0, paddingInline: 0 }}>
                    Currency
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow
                  sx={{
                    height: "30px",
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
                      disabled={paymentRequestDetails.status === 2}
                      size="small"
                      value={paymentRequestDetails.recipient}
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
                      paddingLeft: "10px",
                      // minHeight: "40px",
                    }}
                  >
                    <TextField
                      sx={{
                        "& fieldset": { border: "none" },
                      }}
                      disabled={paymentRequestDetails.status === 2}
                      size="small"
                      value={paymentRequestDetails.amount}
                      fullWidth
                      // id="fullWidth"
                      placeholder="Enter wallet address"
                      InputProps={{
                        style: { padding: 0 },
                        readOnly: true,
                      }}
                    />
                    {/* {paymentRequestDetails.amount} */}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid var(--border-table)",
                      padding: 0,
                      // minHeight: "40px",
                    }}
                  >
                    <Select
                      disabled={paymentRequestDetails.status === 2}
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
                        {paymentRequestDetails.currency_name}
                      </MenuItem>
                      {/* <MenuItem value="Option2">Twenty</MenuItem> */}
                    </Select>
                  </TableCell>
                </TableRow>
                {/* ))} */}
              </TableBody>
            </Table>
          </TableContainer>
          {/* note info */}
          <NoteInformation>
            <h3>Note Information</h3>

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
                  {/* {categoryProperties?.map((property: any) => ( */}
                  {selectedCategory.properties?.map((property: any) => (
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
                                .filter(
                                  (p: any) =>
                                    p.type === "single-select" &&
                                    p.name === property.name
                                )
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
                  {/* {categoryProperties?.map((property: any) => ( */}
                  {selectedCategory.properties?.map(
                    (property: any, index: number) => (
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
                                <Image src={multiSelect} alt="" />{" "}
                                {property.name}
                              </NoteInfo>
                            </TableCell>

                            <TableCell onBlur={handleUpdateCategory}>
                              <ReactSelect
                                isDisabled={paymentRequestDetails.status === 2}
                                value={selectedValues}
                                onChange={(
                                  selectedOptions: ReactSelectOption[]
                                ) =>
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
                                defaultValues={parseCategoryProperties
                                  .filter(
                                    (p: any) =>
                                      p.type === "multi-select" &&
                                      p.name === property.name
                                  )
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
                    )
                  )}
                  {/* {categoryProperties?.map((property: any) => ( */}
                  {selectedCategory.properties?.map((property: any) => (
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
                              // value={propertyContent}
                              value={
                                proPertyTextValue[property.name]?.values || ""
                              }
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
            {/* rejected status */}
            {paymentRequestDetails.status === 2 && (
              <PaymentStatus>
                <img src={statusIcon} alt="" />
                <p>Status: Rejected</p>
              </PaymentStatus>
            )}
          </NoteInformation>
          {/* <ReactSelect /> */}
        </RequestDetails>
      </WorkspaceItemDetailsLayout>
    </>
  );
};

export default PaymentRequestDetails;

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
