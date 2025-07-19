import { FormControl, Text, FormLabel, Flex, Box } from "@chakra-ui/react";
import makeAnimated from "react-select/animated";
import { useField } from "formik";
import React from "react";
import Select from "react-select";

const animatedComponent = makeAnimated();

export interface Option {
  label: string;
  value: number | string;
  icon?: React.ReactElement;
}

interface SelectProps {
  name: string;
  placeholder?: string;
  options: Option[];
  onChange?: (selectedOption: Option) => void;
  defaultValue?: Option | undefined;
  outlineColor?: string;
  width?: string;
  height?: string;
  caretColor?: string;
  background?: string;
  fontSize?: string;
  menuBg?: string;
  labelColor?: string;
  label?: string;
  radius?: string;
  menuWidth?: string;
  noBorder?: boolean;
  fontWeight?: string;
  labelInfo?: string;
  multi?: "yes" | "no";
  isDisabled?: boolean;
  icon?: React.ReactElement;
}

export const SelectField = ({
  options,
  placeholder,
  onChange,
  defaultValue,
  outlineColor,
  width,
  height,
  caretColor,
  background,
  fontSize,
  menuBg,
  label,
  labelColor,
  menuWidth,
  radius,
  name,
  labelInfo,
  noBorder,
  multi,
  fontWeight,
  icon,
  ...props
}: SelectProps) => {
  const [field, meta, helpers] = useField(name);
  const { value } = meta;
  const { setValue } = helpers;

  // to bypass the hydration error
  const id = Date.now().toString();
  const [isMounted, setMounted] = React.useState<boolean>(false);
  React.useEffect(() => setMounted(true), []);

  const handleChange = (selectedOption: any) => {
    if (multi === "yes") {
      setValue(selectedOption);
    } else {
      setValue(selectedOption?.value || "");
    }

    if (onChange) {
      onChange(selectedOption as Option);
    }
  };

  return (
    <>
      {isMounted && (
        <FormControl>
          {label && (
            <FormLabel
              fontSize="14px"
              lineHeight="20px"
              fontWeight="400"
              color={labelColor || "#211E1D"}>
              {label}{" "}
              {labelInfo && (
                <Text as="span" color="var(--deep-blood)">
                  *{labelInfo}
                </Text>
              )}
            </FormLabel>
          )}

          <Flex
            width={width || "100%"}
            alignItems="center"
            borderRadius={radius || "8px"}
            border={noBorder ? "none" : `1px solid ${outlineColor || "#ccc"}`}
            bg={background || "#fff"}
            overflow="hidden">
            {icon && (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="20px"
                height={height || "20px"}
                bg={background || "#f5f5f5"}
                ml="12px">
                {icon}
              </Box>
            )}
            <Box flex="1">
              <Select
                {...field}
                {...props}
                isMulti={multi === "yes"}
                value={options.find((opt) => opt.value === value) || null}
                instanceId={id}
                onChange={handleChange}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                components={animatedComponent}
                placeholder={placeholder}
                options={options}
                defaultValue={defaultValue}
                noOptionsMessage={() => (
                  <Text color="var(--text-primary)">No options found</Text>
                )}
                formatOptionLabel={(option: Option) => (
                  <Flex alignItems="center">
                    {option.icon && (
                      <Box mr="8px" display="flex">
                        {option.icon}
                      </Box>
                    )}
                    <span>{option.label}</span>
                  </Flex>
                )}
                styles={{
                  control: (baseStyles) => ({
                    ...baseStyles,
                    height,
                    fontSize,
                    border: "none",
                    boxShadow: "none",
                    borderRadius: "0",
                    background: "transparent",
                  }),
                  menu: (baseStyles) => ({
                    ...baseStyles,
                    zIndex: 9999,
                    backgroundColor: menuBg || "#fff",
                    width: menuWidth || "auto",
                  }),
                  placeholder: (baseStyles) => ({
                    ...baseStyles,
                    fontSize: fontSize || "14px",
                    color: "var(--input-placeholder)",
                  }),
                  menuPortal: (baseStyles) => ({
                    ...baseStyles,
                    zIndex: 1600,
                  }),
                }}
              />
            </Box>
          </Flex>

          {meta.touched && meta.error && (
            <Text color="var(--deep-blood)" fontSize="sm" mt="-.4em">
              {meta.error}
            </Text>
          )}
        </FormControl>
      )}
    </>
  );
};
