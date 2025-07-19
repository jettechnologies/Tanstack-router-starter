import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  SimpleGrid,
  Flex,
  IconButton,
  PopoverHeader,
  PopoverCloseButton,
  HStack,
  Box,
  VStack,
  Button,
} from "@chakra-ui/react";
import { CaretRight, CaretLeft, CalendarBlank } from "@phosphor-icons/react";
import {
  format,
  addMonths,
  subMonths,
  isAfter,
  isSameDay,
  startOfToday,
  eachDayOfInterval,
  addDays,
  subDays,
} from "date-fns";
import { type FormikProps } from "formik";
import { ParagraphText } from "../typography"; // Assuming this component exists in your project
// import { CustomButton } from "./Button";

interface MultiDatePickerProps {
  formik: FormikProps<any>;
  fieldName: string;
  inputField?: {
    label?: string;
    isActive?: boolean;
    placeholder?: string;
    icon?: React.ReactElement;
  };
  height?: string;
  borderColor?: string;
  color?: string;
  iconColor?: string;
  onExcludedDatesChange?: (excludedDates: Date[]) => void;
  onDatesSelected?: (selectedDates: Date[]) => void;
}

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const MultiDatePicker = ({
  formik,
  fieldName,
  inputField = {
    isActive: false,
  },
  height = "40px",
  borderColor,
  color,
  iconColor,
  onExcludedDatesChange,
  onDatesSelected,
}: MultiDatePickerProps) => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [excludedDates, setExcludedDates] = useState<Date[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const initialFocusRef = useRef<HTMLButtonElement>(null);

  const calculateExcludedDates = (dates: Date[]) => {
    if (dates.length < 2) return [];

    // Sort dates chronologically
    const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());
    const excluded: Date[] = [];

    // Check for gaps between consecutive dates
    for (let i = 0; i < sortedDates.length - 1; i++) {
      const current = sortedDates[i];
      const next = sortedDates[i + 1];

      // If dates are not consecutive, add the dates in between to excluded
      if (next.getTime() - current.getTime() > 24 * 60 * 60 * 1000) {
        const start = addDays(current, 1);
        const end = subDays(next, 1);

        const dateRange = eachDayOfInterval({ start, end });
        excluded.push(...dateRange);
      }
    }

    return excluded;
  };

  const handleDateSelect = (newDate: Date) => {
    if (
      isSameDay(newDate, startOfToday()) ||
      isAfter(newDate, startOfToday())
    ) {
      let newSelectedDates: Date[] = [];

      if (selectedDates.some((date) => isSameDay(date, newDate))) {
        newSelectedDates = selectedDates.filter(
          (date) => !isSameDay(date, newDate)
        );
      } else {
        newSelectedDates = [...selectedDates, newDate];
      }

      newSelectedDates.sort((a, b) => a.getTime() - b.getTime());
      setSelectedDates(newSelectedDates);

      // Calculate excluded dates
      const newExcludedDates = calculateExcludedDates(newSelectedDates);
      setExcludedDates(newExcludedDates);

      formik.setFieldValue(fieldName, newSelectedDates);
      if (onExcludedDatesChange) onExcludedDatesChange(newExcludedDates);
      if (onDatesSelected) onDatesSelected(newSelectedDates);
    }
  };

  const generateDates = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const dates = [];
    const today = startOfToday();

    // Previous month padding
    for (let i = 0; i < firstDay.getDay(); i++) {
      const d = new Date(year, month, -i);
      dates.unshift({ date: d, isCurrentMonth: false, isPast: d < today });
    }

    // Current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i);
      dates.push({ date: d, isCurrentMonth: true, isPast: d < today });
    }

    // Next month padding
    const remainingDays = 7 - (dates.length % 7);
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        const d = new Date(year, month + 1, i);
        dates.push({ date: d, isCurrentMonth: false, isPast: false });
      }
    }

    return dates;
  };

  const changeMonth = (increment: number) => {
    setCurrentMonth((prevMonth) => addMonths(prevMonth, increment));
  };

  useEffect(() => {
    if (isOpen && initialFocusRef.current) {
      initialFocusRef.current.focus();
    }
  }, [isOpen]);

  const isDateSelected = (date: Date) => {
    return selectedDates.some((d) => isSameDay(d, date));
  };

  const isDateExcluded = (date: Date) => {
    return excludedDates.some((d) => isSameDay(d, date));
  };

  const handleCancel = () => {
    setSelectedDates([]);
    setExcludedDates([]);
    formik.setFieldValue(fieldName, []);
    formik.setFieldValue("excludedDates", []);
    formik.setFieldValue("numberOfDays", "");
    setIsOpen(false);
  };

  return (
    <Popover
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      initialFocusRef={initialFocusRef}
      placement="bottom-start">
      <PopoverTrigger>
        {inputField && inputField.isActive ? (
          <Box>
            <ParagraphText
              value={inputField?.label ?? "Select Dates"}
              color="var(--neutral)"
              weight="400"
              textTransform="capitalize"
            />
            <HStack
              py={"8px"}
              px={"12px"}
              bgColor="var(--white)"
              borderRadius={"6px"}
              border={`1px solid ${borderColor || "var(--neutral-200)"}`}
              display="flex"
              spacing={1}
              onClick={() => setIsOpen(true)}
              mt={1}
              height={height}
              cursor="pointer">
              {inputField?.icon || (
                <CalendarBlank
                  size={20}
                  color={iconColor || "var(--neutral-300)"}
                />
              )}
              <ParagraphText
                value={
                  selectedDates.length > 0
                    ? `${selectedDates.length} date${selectedDates.length > 1 ? "s" : ""} selected`
                    : "Select dates"
                }
                color={color || "var(--neutral-300)"}
                weight="400"
              />
            </HStack>
          </Box>
        ) : (
          <Text
            cursor="pointer"
            textDecor={selectedDates.length > 0 ? "none" : "underline"}
            onClick={() => setIsOpen(true)}
            color={selectedDates.length > 0 ? "gray.500" : "blue.500"}>
            {selectedDates.length > 0
              ? `${selectedDates.length} date${selectedDates.length > 1 ? "s" : ""} selected`
              : "Select dates"}
          </Text>
        )}
      </PopoverTrigger>

      <PopoverContent width="360px">
        <PopoverHeader borderBottom="none">
          <Text textAlign="center" fontWeight="medium">
            Select Dates
          </Text>
        </PopoverHeader>

        <PopoverCloseButton />

        <PopoverBody mx="1em">
          <Flex justifyContent="space-between" alignItems="center" mb={2}>
            <IconButton
              aria-label="Previous month"
              icon={<CaretLeft />}
              onClick={() => changeMonth(-1)}
              size="sm"
            />
            <Text fontWeight="500">{format(currentMonth, "MMMM yyyy")}</Text>
            <IconButton
              aria-label="Next month"
              icon={<CaretRight />}
              onClick={() => changeMonth(1)}
              size="sm"
            />
          </Flex>

          <SimpleGrid columns={7} spacing={2} mb={4}>
            {daysOfWeek.map((day) => (
              <Text
                key={day}
                textAlign="center"
                fontWeight="bold"
                fontSize="sm">
                {day}
              </Text>
            ))}
          </SimpleGrid>

          <SimpleGrid columns={7} spacing={2} mb={4}>
            {generateDates(
              currentMonth.getFullYear(),
              currentMonth.getMonth()
            ).map(({ date: d, isCurrentMonth, isPast }) => (
              <Button
                key={d.toISOString()}
                height="32px"
                p={0}
                borderRadius="md"
                background={
                  isDateSelected(d)
                    ? "var(--coral)"
                    : isDateExcluded(d)
                      ? "gray.200"
                      : "white"
                }
                color={
                  isPast
                    ? "gray.400"
                    : isCurrentMonth
                      ? isDateSelected(d)
                        ? "white"
                        : "black"
                      : "gray.300"
                }
                _hover={{ background: isPast ? "none" : "var(--coral-400)" }}
                isDisabled={isPast}
                onClick={() => handleDateSelect(d)}
                ref={
                  d.getDate() === 15 && d.getMonth() === currentMonth.getMonth()
                    ? initialFocusRef
                    : undefined
                }>
                {d.getDate()}
              </Button>
            ))}
          </SimpleGrid>

          <VStack
            spacing={1}
            align="stretch"
            mt={2}
            pt={2}
            borderTop="1px"
            borderColor="gray.200">
            <Text fontSize="xs" color="gray.500">
              Selected dates:{" "}
              {selectedDates.length > 0
                ? selectedDates.map((d) => format(d, "MMM d")).join(", ")
                : "None"}
            </Text>
            <Text fontSize="xs" color="gray.500">
              Excluded dates:{" "}
              {excludedDates.length > 0
                ? excludedDates.map((d) => format(d, "MMM d")).join(", ")
                : "None"}
            </Text>

            <HStack spacing="1rem" height="47px" mt={2}>
              <Button variant="outline" onClick={handleCancel} height="full">
                Cancel
              </Button>
              <Button
                variant="solid"
                onClick={() => setIsOpen(false)}
                height="full">
                Apply
              </Button>
            </HStack>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
