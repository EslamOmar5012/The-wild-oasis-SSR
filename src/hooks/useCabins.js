import { useQuery } from "@tanstack/react-query";
import { getCabins } from "../services/apiCabins";

const useCabins = () => {
  const {
    isPending,
    data: cabins,
    isError,
    error,
  } = useQuery({
    queryKey: ["cabin table"],
    queryFn: async () => {
      const data = await getCabins();
      return data;
    },
  });

  return [isPending, cabins, isError, error];
};

export { useCabins };
