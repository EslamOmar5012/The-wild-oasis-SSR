import TableOperations from "../../ui/TableOperations";
import Filter from "../../ui/Filter";
import SortBy from "../../ui/SortBy";

function CabinTableOperations() {
  return (
    <TableOperations>
      <Filter
        filterField="discount"
        options={[
          { value: "all", label: "all" },
          { value: "no-discount", label: "no-discount" },
          { value: "discount", label: "discount" },
        ]}
      />

      <SortBy
        options={[
          { value: "name-asc", label: "Sort by name (A-Z)" },
          { value: "name-desc", label: "Sort by name (Z-A)" },
          {
            value: "regularPrice-asc",
            label: "Sort by regularPrice (low first)",
          },
          {
            value: "regularPrice-desc",
            label: "Sort by regularPrice (high first)",
          },
          {
            value: "capacity-asc",
            label: "Sort by capacity (low first)",
          },
          {
            value: "capacity-desc",
            label: "Sort by capacity (high first)",
          },
        ]}
      />
    </TableOperations>
  );
}

export default CabinTableOperations;
