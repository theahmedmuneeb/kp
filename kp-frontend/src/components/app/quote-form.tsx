"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Controller, FieldError, FieldErrors, useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuoteFormSchema } from "@/schema/quote-form";
import { z } from "zod";
import axios from "axios";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "../ui/file-upload";
import { Plus, X } from "lucide-react";
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputLabel,
  TagsInputList,
} from "@/components/ui/tags-input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RiInformation2Fill } from "@remixicon/react";

type QuoteForm = z.infer<typeof QuoteFormSchema>;

export default function QuoteForm() {
  const [colors, setColors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    setError,
    reset,
    formState: { errors },
  } = useForm<QuoteForm>({
    defaultValues: {
      mockupChoice: true,
      mockup: [],
    },
    resolver: zodResolver(QuoteFormSchema),
  });

  const onSubmit = async (data: QuoteForm) => {
    setSubmitting(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "mockupChoice") {
        // Nothing
      } else if (
        key === "mockup" &&
        Array.isArray(value) &&
        value.length > 0 &&
        watch("mockupChoice")
      ) {
        formData.append(key, value[0]);
      } else if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, v));
      } else if (value !== undefined) {
        formData.append(key, String(value));
      }
    });
    try {
      const { data: quote } = await axios.post<{
        success: boolean;
        message: string;
      }>("/api/quote", formData);

      if (!quote.success) {
        toast.error(quote.message || "Failed to submit form");
        return;
      }
      reset();
      setColors([]);
      toast.success("Form submitted successfully!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to submit form");
      } else {
        toast.error("Failed to submit form");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const onError = (err: FieldErrors<QuoteForm>) => {
    const [field, error] = Object.entries(err)[0];
    if (field === "colors") {
      if (Array.isArray(error)) {
        toast.info(error.filter((e) => e)[0].message || "Form has errors");
      } else {
        toast.info((error as FieldError)?.message || "Form has errors");
      }
      setTimeout(() => {
        document.getElementById("colors")?.focus();
      }, 10);
      setTimeout(() => {}, 1000);
    } else {
      toast.info((error as FieldError)?.message || "Form has errors");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-4 font-montserrat px-4 md:px-5 lg:px-8 text-sm ${
        submitting ? "pointer-events-none !select-none opacity-60" : ""
      }`}
    >
      {/* Name */}
      <div className="flex flex-col gap-0.5">
        <label className="font-semibold" htmlFor="name">
          Name:
        </label>
        <input
          {...register("name")}
          type="text"
          id="name"
          disabled={submitting}
          className="p-2 outline-0 border-4 border-primary font-medium w-full"
        />
      </div>
      {/* Brand Name */}
      <div className="flex flex-col gap-0.5">
        <label className="font-semibold" htmlFor="brand">
          Brand name:
        </label>
        <input
          {...register("brand")}
          type="text"
          id="brand"
          disabled={submitting}
          className="p-2 outline-0 border-4 border-primary font-medium w-full"
        />
      </div>
      {/* Email */}
      <div className="lg:col-span-2 flex flex-col gap-0.5">
        <label className="font-semibold" htmlFor="email">
          Email:
        </label>
        <input
          {...register("email")}
          type="text"
          id="email"
          disabled={submitting}
          className="p-2 outline-0 border-4 border-primary font-medium w-full"
        />
      </div>
      {/* Quantity */}
      <div className="flex flex-col gap-0.5">
        <label className="font-semibold" htmlFor="quantity">
          Total quantity needed:
        </label>
        <input
          {...register("quantity", {
            setValueAs: (v) => (v === "" ? 0 : Number(v)),
          })}
          type="number"
          id="quantity"
          disabled={submitting}
          className="p-2 outline-0 border-4 border-primary font-medium w-full"
        />
      </div>
      {/* Deadline */}
      <div className="flex flex-col gap-0.5">
        <label className="font-semibold" htmlFor="deadline">
          Deadline (if applicable):
        </label>
        <input
          {...register("deadline", {
            setValueAs: (v) => (v === "" ? undefined : new Date(v)),
          })}
          type="date"
          id="deadline"
          disabled={submitting}
          className="p-2 outline-0 border-4 border-primary font-medium w-full"
        />
      </div>
      {/* Garment Type */}
      <div className="lg:col-span-2 flex flex-col gap-0.5">
        <label className="font-semibold" htmlFor="garment">
          Garment type (hoodie, t-shirt, crewneck, etc):
        </label>
        <input
          {...register("garment")}
          type="text"
          id="garment"
          disabled={submitting}
          className="p-2 outline-0 border-4 border-primary font-medium w-full"
        />
      </div>
      {/* Blank */}
      <div className="lg:col-span-2 flex flex-col gap-0.5">
        <label className="font-semibold" htmlFor="blank">
          Blank (LA Apparel, Shaka Wear, etc)
        </label>
        <input
          {...register("blank")}
          type="text"
          id="blank"
          disabled={submitting}
          className="p-2 outline-0 border-4 border-primary font-medium w-full"
        />
      </div>
      {/* colors */}
      <div className="flex flex-col">
        <TagsInput
          value={colors}
          onValueChange={(v) => {
            setColors(v);
            setValue("colors", v);
          }}
          max={6}
          className="w-auto gap-0.5"
          editable
          addOnPaste
        >
          <TagsInputLabel className="flex items-center text-sm font-semibold">
            Colors in design (up to 6):
            <Tooltip>
              <TooltipTrigger
                onClick={(e) => e.preventDefault()}
                className="ml-1"
              >
                <RiInformation2Fill className="size-5 lg:size-4" />
              </TooltipTrigger>
              <TooltipContent className="max-w-3xs px-2 font-semibold font-montserrat uppercase">
                <p>
                  Add a color by typing and pressing Enter, or by using a comma.
                </p>
              </TooltipContent>
            </Tooltip>
          </TagsInputLabel>
          <TagsInputList className="bg-secondary border-4 border-primary focus-within:ring-0 min-h-12">
            {colors.map((color) => (
              <TagsInputItem
                className="normal-case rounded-none border-2 border-accent text-acent font-medium"
                key={color}
                value={color}
              >
                {color}
              </TagsInputItem>
            ))}
            <TagsInputInput
              className="text-accent font-semibold placeholder:text-accent"
              placeholder="Add color..."
            />
          </TagsInputList>
        </TagsInput>
      </div>
      {/* Print Location */}
      <div className="flex flex-col gap-0.5">
        <label className="font-semibold" htmlFor="print-location">
          Print location on garment:
        </label>
        <input
          {...register("printLocation")}
          type="text"
          id="print-location"
          disabled={submitting}
          className="p-2 outline-0 border-4 border-primary font-medium w-full"
        />
      </div>
      {/* Mockup Choice */}
      <div className="lg:col-span-2 xl:col-span-1 flex flex-col gap-0.5 select-none">
        <label className="font-semibold" htmlFor="mockup-choice">
          Do you have a mock up?
        </label>
        <Controller
          name="mockupChoice"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-4">
              <button
                className={`border-4 border-primary text-primary font-bold px-6 h-12 uppercase cursor-pointer ${
                  field.value ? "bg-primary !text-accent" : ""
                }`}
                type="button"
                disabled={submitting}
                onClick={() => field.onChange(true)}
              >
                Yes
              </button>
              <button
                className={`border-4 border-primary text-primary font-bold px-6 h-12 uppercase cursor-pointer ${
                  !field.value ? "bg-primary !text-accent" : ""
                }`}
                type="button"
                disabled={submitting}
                onClick={() => field.onChange(false)}
              >
                No
              </button>
            </div>
          )}
        />
      </div>
      {/* mockup */}
      {watch("mockupChoice") && (
        <div className="lg:col-span-2 xl:col-span-1 flex flex-col gap-0.5">
          <label className="font-semibold" htmlFor="mockup">
            Upload mock (if applicable):
          </label>
          <Controller
            name="mockup"
            control={control}
            rules={{
              validate: (files) =>
                (files && files.length > 0) || "Please select a file",
            }}
            render={({ field }) => (
              <FileUpload
                value={field.value}
                onValueChange={(files) => {
                  const latestFile =
                    files.length > 0 ? [files[files.length - 1]] : [];
                  field.onChange(latestFile);
                }}
                accept=".pdf, .jpg, .jpeg, .png"
                maxSize={50 * 1024 * 1024}
                onFileReject={(_, message) => {
                  setError("mockup", {
                    message,
                  });
                  toast.error(message);
                }}
                multiple={false}
              >
                <FileUploadDropzone className="text-xs text-primary text-center flex-col flex-wrap gap-0.5 border-solid border-4 border-primary py-0.5 h-12">
                  <FileUploadTrigger asChild>
                    <Button variant="link" className="p-0">
                      <Plus strokeWidth={4} className="size-4" />
                    </Button>
                  </FileUploadTrigger>
                  <span className="font-semibold font-montserrat">
                    PDF, PNG, JPEG (UP TO 50 MB):
                  </span>
                </FileUploadDropzone>
                <FileUploadList>
                  {(field.value || []).map((file: File, index: number) => (
                    <FileUploadItem key={index} value={file}>
                      <FileUploadItemPreview />
                      <FileUploadItemMetadata />
                      <FileUploadItemDelete asChild>
                        <Button variant="ghost" size="icon" className="size-7">
                          <X />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </FileUploadItemDelete>
                    </FileUploadItem>
                  ))}
                </FileUploadList>
              </FileUpload>
            )}
          />
        </div>
      )}
      <div className="lg:col-span-2 flex flex-col items-center mt-5">
        <Button
          className="uppercase !px-10 font-extrabold"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit"}
        </Button>
        {submitting && (
          <span className="mt-3 text-xs font-montserrat text-center">
            This may take some time. Please do not refresh or leave the page.
          </span>
        )}
      </div>
    </form>
  );
}
