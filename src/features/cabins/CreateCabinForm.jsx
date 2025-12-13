import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditCabin } from "../../services/apiCabins";
import { showToast } from "../../utils/helpers";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/formRow";

import z from "zod";
import { useCreateCabin } from "../../hooks/useCreateCabin";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/x-icon",
];

function CreateCabinForm({ hideForm, cabinToEdit = {} }) {
  const { id: editId, ...editValues } = cabinToEdit;
  console.log(editId);
  const isEditSession = Boolean(editId);

  const cabinSchema = z.object({
    name: z
      .string({
        error: "name is required",
      })
      .min(3, "Name must be at least 3 characters")
      .max(6, "Name cannot exceed 6 characters"),

    maxCapacity: z
      .number({
        error: "maximum capacity is required",
      })
      .min(2, "Max capacity must be at least 2")
      .max(10, "Max capacity cannot exceed 10"),

    regularPrice: z
      .number({
        error: "regular Price is required",
      })
      .min(300, "Regular price must be at least 450")
      .max(2500, "Regular price cannot exceed 2500"),

    discount: z
      .number({
        error: "discount is required",
      })
      .min(0, "Discount cannot be negative")
      .max(250, "Discount cannot be more than 250$"),

    description: z
      .string({
        error: "description is required",
      })
      .min(0, "Description must be at least 30 characters")
      .max(100, "Description cannot exceed 100 characters")
      .optional()
      .or(z.literal("")),

    image: z
      .any()
      .refine((file) => {
        if (isEditSession) {
          if (typeof file !== "string") {
            return file[0]?.size <= MAX_FILE_SIZE;
          } else return true;
        }

        return file[0]?.size <= MAX_FILE_SIZE;
      }, `Max image size is 5MB.`)
      .refine((file) => {
        if (isEditSession) {
          if (typeof file !== "string")
            return ACCEPTED_IMAGE_TYPES.includes(file[0]?.type);
          else return true;
        }
        return ACCEPTED_IMAGE_TYPES.includes(file[0]?.type);
      }, "Only .jpg, .jpeg, .png, .ico and .webp formats are supported.")
      .optional()
      .or(z.literal("")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: isEditSession ? editValues : {},
    resolver: zodResolver(cabinSchema),
  });

  const [isCreating, createCabin] = useCreateCabin(reset, hideForm);

  const queryClinet = useQueryClient();

  const { isPending: isEditing, mutate: editCabin } = useMutation({
    mutationFn: ({ newCabinData, id }) => createEditCabin(newCabinData, id),
    onSuccess: () => {
      showToast("Cabin edited successfully", "success");
      queryClinet.invalidateQueries(["cabin table"]);
      reset();
      hideForm();
    },
    onError: (error) => {
      showToast(error.message, "error");
    },
  });

  const isLoading = isCreating || isEditing;

  const onSubmit = (data) => {
    const image = typeof data.image === "string" ? data.image : data.image[0];
    // console.log(data);

    if (isEditSession)
      editCabin({ newCabinData: { ...data, image }, id: editId });
    else createCabin({ ...data, image });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="cabin name" error={errors.name}>
        <Input type="text" id="name" {...register("name")} />
      </FormRow>

      <FormRow label="Maximum capacity" error={errors.maxCapacity}>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isLoading}
          {...register("maxCapacity", { valueAsNumber: true })}
        />
      </FormRow>

      <FormRow label="Regular price" error={errors.regularPrice}>
        <Input
          type="number"
          id="regularPrice"
          disabled={isLoading}
          {...register("regularPrice", { valueAsNumber: true })}
        />
      </FormRow>

      <FormRow label="Discount" error={errors.discount}>
        <Input
          type="number"
          id="discount"
          defaultValue={0}
          disabled={isLoading}
          {...register("discount", { valueAsNumber: true })}
        />
      </FormRow>

      <FormRow label="description for cabin" error={errors.description}>
        <Textarea
          type="number"
          id="description"
          defaultValue=""
          disabled={isLoading}
          {...register("description")}
        />
      </FormRow>

      <FormRow label="cabin photo" error={errors.image}>
        <FileInput id="image" accept="image/*" {...register("image")} />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          $variation="secondary"
          $size="medium"
          type="reset"
          onClick={() => {
            if (isEditSession) hideForm();
          }}
        >
          Cancel
        </Button>
        <Button
          $variation="primary"
          $size="medium"
          type="submit"
          disabled={isLoading}
        >
          {isLoading
            ? "Loading..."
            : isEditSession
            ? "Edit cabin"
            : "Create new cabin"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
