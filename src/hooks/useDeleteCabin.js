import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCabin as deleteCabinApi } from "../services/apiCabins";
import { showToast } from "../utils/helpers";

const useDeleteCabin = (cabinName) => {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deleteCabin } = useMutation({
    mutationFn: ({ id, image }) => deleteCabinApi(id, image),
    onSuccess: () => {
      queryClient.invalidateQueries(["cabin tables"]);
      showToast(`cabin ${cabinName} has been deleted successfully`, "success");
    },
    onError: (error) => {
      showToast(error.message, "error");
    },
  });

  return [isDeleting, deleteCabin];
};

export { useDeleteCabin };
