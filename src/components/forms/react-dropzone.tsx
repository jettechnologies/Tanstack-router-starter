import React, {
  useMemo,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useDropzone, type Accept } from "react-dropzone";
import { useField } from "formik";
import { Box, Progress, Text, Image, Center } from "@chakra-ui/react";
import { useToastContext } from "@hooks/context";
// import { ParagraphText } from "./typography";

interface EventDropzoneProps {
  name: string;
  accept: Accept | undefined;
  maxFiles?: number;
  maxSize?: number;
  borderColor?: string;
  borderRadius?: string | number;
  multiple?: boolean;
  children?: React.ReactNode;
  onImageUpload?: (file: File[] | File) => void;
  type?: "primary" | "secondary";
}

const ReusableDropzone = forwardRef(
  (
    {
      name,
      accept,
      maxFiles = 1,
      maxSize = 2048576,
      children,
      borderColor = "var(--neutral-200)",
      borderRadius = "1rem",
      multiple,
      onImageUpload,
      type = "primary",
    }: EventDropzoneProps,
    ref
  ) => {
    const [field, meta, helpers] = useField(name); // Use Formik's useField hook
    console.log(field, "field");
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [previews, setPreviews] = useState<string[]>([]);
    const { openToast } = useToastContext();
    // Prevent duplicate open calls
    const isOpening = useRef(false);

    const handleFilePreview = (files: File[]) => {
      const previewUrls = files.map((file) =>
        file.type.startsWith("image/") ? URL.createObjectURL(file) : file.name
      );
      setPreviews(previewUrls);
      if (onImageUpload) onImageUpload(files);
      helpers.setValue(multiple ? files : files[0]);
    };

    const {
      getRootProps,
      getInputProps,
      open: dropzoneOpen,
      // fileRejections,
      // isFocused,
      isDragAccept,
      isDragReject,
      acceptedFiles,
    } = useDropzone({
      accept,
      multiple: multiple || false,
      maxFiles,
      maxSize,
      onDrop: (acceptedFiles) => {
        helpers.setTouched(true); // Mark the field as touched
        setUploading(true);
        handleFilePreview(acceptedFiles);

        // Simulate upload progress
        const uploadInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 100) {
              clearInterval(uploadInterval);
              setUploading(false);
              return 100;
            }
            return prev + 10;
          });
        }, 500);
      },
      onDropRejected: (rejections) => {
        const errorMessages = rejections
          .flatMap(({ file, errors }) =>
            errors.map((error) => `${file.name}: ${error.message}`)
          )
          .join("\n");
        helpers.setError(errorMessages); // Update Formik field error
        openToast(errorMessages, "error");
        setUploading(false);
      },
    });

    // Expose `open` function to parent components via ref
    useImperativeHandle(ref, () => ({
      open: () => {
        if (!isOpening.current) {
          isOpening.current = true;
          dropzoneOpen();
          setTimeout(() => (isOpening.current = false), 300);
        }
      },
    }));

    console.log(acceptedFiles, "acceptedFiles");

    const baseStyle = {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "16px 24px",
      borderWidth: "1.5px",
      borderRadius: borderRadius,
      borderColor: borderColor,
      borderStyle: "dashed",
      backgroundColor: "var(--white)",
      outline: "none",
      transition: "border .24s ease-in-out",
    };

    // const focusedStyle = { borderColor: "#2196f3" };
    const acceptStyle = { borderColor: "var(--primary)" };
    const rejectStyle = { borderColor: "var(--coral)" };

    const style = useMemo(
      () => ({
        ...baseStyle,
        // ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {}),
      }),
      [isDragAccept, isDragReject]
    );

    return (
      <Box className="dropzone" height="85%">
        <Box
          {...getRootProps({ style: style as any })}
          className={isDragReject ? "shake" : ""}
          height="100%">
          <input {...getInputProps()} />
          {/* {children} */}
          {!uploading && previews.length > 0 ? (
            <Center
              width="100%"
              height="100%"
              minHeight={type === "primary" ? "200px" : "150px"}
              maxHeight="250px"
              mt={2}>
              {previews.map((preview, index) => (
                <Box key={index} mb={4} display="inline-flex" height="full">
                  {preview.startsWith("blob:") ? (
                    <Image
                      src={preview}
                      alt={`Preview ${index}`}
                      width="100%"
                      height={type === "primary" ? "200px" : "100px"}
                      objectFit="cover"
                      mr={2}
                    />
                  ) : (
                    <Text>{preview}</Text>
                  )}
                </Box>
              ))}
            </Center>
          ) : (
            children
          )}
          {uploading && (
            <Box mt={4} width="100%">
              <Progress value={uploadProgress} size="xs" colorScheme="green" />
            </Box>
          )}
        </Box>

        {/* File Previews */}

        {/* Error Feedback */}
        {meta.touched && meta.error && (
          <Text color="var(--coral)" mt={2} fontSize="sm">
            {meta.error}
          </Text>
        )}
      </Box>
    );
  }
);

export default ReusableDropzone;
