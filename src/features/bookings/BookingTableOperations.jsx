import SortBy from "../../ui/SortBy";
import Filter from "../../ui/Filter";
import TableOperations from "../../ui/TableOperations";

function BookingTableOperations() {
  return (
    <TableOperations>
      <Filter
        filterField="status"
        options={[
          { value: "all", label: "all" },
          { value: "checked-out", label: "checked out" },
          { value: "checked-in", label: "checked in" },
          { value: "unconfirmed", label: "unconfirmed" },
        ]}
      />

      <SortBy
        options={[
          { value: "startDate-desc", label: "sort by date (recent first)" },
          { value: "startDate-asc", label: "sort by date (earlier first)" },
          {
            value: "totalPrice-desc",
            label: "sort by amount (high first)",
          },
          { value: "totalPrice-asc", label: "sort by amount (low first)" },
        ]}
      />
    </TableOperations>
  );
}

export default BookingTableOperations;
