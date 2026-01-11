import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditCabin } from "../services/apiCabins";
import { showToast } from "../utils/helpers";

const useEditCabin = (reset = undefined, hideForm = undefined) => {
  const queryClinet = useQueryClient();

  const { isPending: isEditing, mutate: editCabin } = useMutation({
    mutationFn: ({ newCabinData, id }) => createEditCabin(newCabinData, id),
    onSuccess: () => {
      showToast("Cabin edited successfully", "success");
      queryClinet.invalidateQueries(["cabin table"]);
      if (reset) reset();
      if (hideForm) hideForm();
    },
    onError: (error) => {
      showToast(error.message, "error");
    },
  });

  return [isEditing, editCabin];
};

export { useEditCabin };
