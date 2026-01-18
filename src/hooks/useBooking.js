import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getBooking } from "../services/apiBookings";

export const useBooking = () => {
  const { id } = useParams();
  const {
    isPending: isLoading,
    data: booking,
    error,
  } = useQuery({
    queryKey: ["booking"],
    queryFn: () => getBooking(id),
    retry: false,
  });

  return [isLoading, booking, error];
};
