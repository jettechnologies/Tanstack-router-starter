import { Box, ChakraProps, Text } from "@chakra-ui/react";

export interface TextProps extends ChakraProps {
  value: string;
  weight?: string;
  family?: string;
  color?: string;
  spanText?: string;
  spanColor?: string;
  align?: "left" | "center" | "right";
}

export const HeaderText = ({ family, value, align }: TextProps) => {
  return (
    <Text
      fontWeight="600"
      fontSize="21px"
      lineHeight="30px"
      fontFamily={family}
      textAlign={align || "center"}
    >
      {value}
    </Text>
  );
};

export const ParagraphText = ({
  weight,
  value,
  align,
  color,
  spanText,
  spanColor,
  ...props
}: TextProps) => {
  return (
    <Text
      fontWeight={weight || "500"}
      fontSize="14px"
      lineHeight="20px"
      textAlign={align || "left"}
      color={color || "var(--neutral)"}
      {...props}
    >
      {value}{" "}
      <Box
        color={spanColor || "var(--neutral)"}
        as="span"
        fontWeight={weight || "700"}
      >
        {spanText}
      </Box>
    </Text>
  );
};