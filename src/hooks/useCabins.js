import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCabins } from "../services/apiCabins";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../utils/constants";

const useCabins = () => {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const {
    isPending,
    data: cabins,
    isError,
    error,
  } = useQuery({
    queryKey: ["cabin table", page],
    queryFn: async () => {
      const data = await getCabins({ page });
      return data;
    },
  });

  const pageCount = Math.ceil(cabins?.count || 1 / PAGE_SIZE);

  //PRE-Fetching
  if (page < pageCount)
    queryClient.prefetchQuery({
      queryKey: ["cabin table", page + 1],
      queryFn: () => getCabins({ page: page + 1 }),
    });

  if (page > 1)
    queryClient.prefetchQuery({
      queryKey: ["cabin table", page - 1],
      queryFn: () => getCabins({ page: page - 1 }),
    });

  return [isPending, cabins, isError, error];
};

export { useCabins };
