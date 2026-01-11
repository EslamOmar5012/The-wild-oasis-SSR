import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "../utils/helpers";
import { createEditCabin } from "../services/apiCabins";

const useCreateCabin = (reset = undefined, hideForm = undefined) => {
  const queryClinet = useQueryClient();

  const { isPending: isCreating, mutate: createCabin } = useMutation({
    mutationFn: (cabinData) => createEditCabin(cabinData),
    onSuccess: () => {
      showToast("Cabin created successfully", "success");
      queryClinet.invalidateQueries(["cabin table"]);
      if (reset) reset();
      if (hideForm) hideForm();
    },
    onError: (error) => {
      showToast(error.message, "error");
    },
  });

  return [isCreating, createCabin];
};

export { useCreateCabin };
