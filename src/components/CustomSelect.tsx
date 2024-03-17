// import { InputAdornment, MenuItem, Select } from "@mui/material";
// import arrowBottom from "../../../assets/workspace/arrow-bottom.svg";
// import { dataSlice } from "ethers";
// import { CategoryProperties } from "../store/useCategoryProperty";

// interface CustomSelectProps {
//   value: string;
//   onChange: (event: any) => void;
//   data: CategoryProperties[]
//   handleClick: (id: number) => void;
// }

// const CustomSelect = ({ value, onChange, data, handleClick }: CustomSelectProps) => {
//   return (
//     <Select
//       labelId={`dropdown label`}
//       id={`dropdown`}
//       value={value}
//       onChange={onChange}
//       size="small"
//       IconComponent={() => (
//         <InputAdornment position="start">
//           <img
//             src={arrowBottom}
//             alt="Custom Arrow Icon"
//             style={{ marginRight: "20px", width: "10px" }}
//           />
//         </InputAdornment>
//       )}
//       sx={{
//         minWidth: "100%",
//         height: "40px",
//         "&.MuiOutlinedInput-root": {
//           "& fieldset": {
//             borderColor: "var(--clr-gray-200)",
//           },
//           "&:hover fieldset": {
//             borderColor: "var(--clr-gray-200)",
//           },
//           "&.Mui-focused fieldset": {
//             borderColor: "var(--clr-gray-200)",
//           },
//         },
//         // "& fieldset": { border: "none" },
//       }}
//     >
//       <MenuItem disabled value="Category">
//         Category name
//       </MenuItem>
//       {data?.map((property: any) => (
//         <MenuItem
//           onClick={handleClick}
//           value={property.name}
//           sx={{
//             "&:hover": {
//               backgroundColor: "var(--clr-gray-100)",
//             },
//             "&.Mui-selected": {
//               backgroundColor: "var(--clr-gray-200)",
//             },
//           }}
//         >
//           {property.name}
//         </MenuItem>
//       ))}
//     </Select>
//   );
// };

// export default CustomSelect;
