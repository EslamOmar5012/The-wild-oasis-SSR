import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../services/apiSettings";

const useSettings = () => {
  const {
    isPending: isLoading,
    data: settingsData,
    error,
  } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });

  if (!settingsData) return [isLoading, {}, error];

  return [isLoading, settingsData, error];
};

export { useSettings };
