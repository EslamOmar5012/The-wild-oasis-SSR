import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSetting } from "../services/apiSettings";
import { showToast } from "../utils/helpers";

const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  const { isPending: isEditing, mutate: updateSettings } = useMutation({
    mutationFn: (newSetting) => updateSetting(newSetting),
    onSuccess: () => {
      showToast("Settings updated successfully", "success");
      queryClient.invalidateQueries(["settings"]);
    },
    onError: (error) => {
      showToast(error.message, "error");
    },
  });

  return [isEditing, updateSettings];
};

export { useUpdateSettings };
