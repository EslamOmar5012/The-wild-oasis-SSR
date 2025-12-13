import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCabin } from "../../services/apiCabins";
import { showToast } from "../../utils/helpers";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/formRow";

import z from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/x-icon",
];

function CreateCabinForm({ hideForm }) {
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
      .refine(
        (file) => file[0]?.size <= MAX_FILE_SIZE,
        `Max image size is 5MB.`
      )
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file[0]?.type),
        "Only .jpg, .jpeg, .png, .ico and .webp formats are supported."
      ),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(cabinSchema),
  });

  const queryClinet = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: createCabin,
    onSuccess: () => {
      showToast("Cabin created successfully", "success");
      queryClinet.invalidateQueries(["cabin table"]);
      reset();
      hideForm();
    },
    onError: (error) => {
      showToast(error.message, "error");
    },
  });

  const onSubmit = (data) => {
    // console.log({ ...data, image: data.image[0] });

    mutate({ ...data, image: data.image[0] });
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
          {...register("maxCapacity", { valueAsNumber: true })}
        />
      </FormRow>

      <FormRow label="Regular price" error={errors.regularPrice}>
        <Input
          type="number"
          id="regularPrice"
          {...register("regularPrice", { valueAsNumber: true })}
        />
      </FormRow>

      <FormRow label="Discount" error={errors.discount}>
        <Input
          type="number"
          id="discount"
          defaultValue={0}
          {...register("discount", { valueAsNumber: true })}
        />
      </FormRow>

      <FormRow label="description for cabin" error={errors.description}>
        <Textarea
          type="number"
          id="description"
          defaultValue=""
          {...register("description")}
        />
      </FormRow>

      <FormRow label="cabin photo" error={errors.image}>
        <FileInput id="image" accept="image/*" {...register("image")} />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button $variation="secondary" $size="medium" type="reset">
          Cancel
        </Button>
        <Button
          $variation="primary"
          $size="medium"
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Loading..." : "Edit cabin"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
