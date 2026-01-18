import { useSearchParams } from "react-router-dom";
import { useCabins } from "../../hooks/useCabins";
import Menus from "../../ui/Menus";

import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import CabinRow from "./CabinRow";
import styled from "styled-components";
import Empty from "../../ui/Empty";
import ErrorHeader from "../../ui/ErrorHeader";

function CabinTable() {
  const [isPending, cabins, isError, error] = useCabins();
  const [searchParams] = useSearchParams();

  if (isPending) return <Spinner />;

  if (isError) return <ErrorHeader>{error.message}</ErrorHeader>;

  if (!cabins.length) return <Empty resourceName="cabins" />;

  // 1) FILTER
  const filterValue = searchParams.get("discount") || "all";

  let filteredCabins;

  switch (filterValue) {
    case "all":
      filteredCabins = cabins;
      break;
    case "no-discount":
      filteredCabins = cabins.filter((cabin) => cabin.discount === 0);
      break;
    case "discount":
      filteredCabins = cabins.filter((cabin) => cabin.discount !== 0);
      break;
  }

  // 2) SORT
  const sortBy = searchParams.get("sortBy") || "startDate-asc";

  const [field, direction] = sortBy.split("-");

  const modifier = direction === "asc" ? 1 : -1;

  const sortedCabins = filteredCabins.sort(
    (a, b) => (a[field] - b[field]) * modifier,
  );

  return (
    <Menus>
      <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
        <Table.Header>
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={sortedCabins}
          render={(cabin) => <CabinRow key={cabin.id} cabin={cabin}></CabinRow>}
        />
      </Table>
    </Menus>
  );
}

export default CabinTable;
