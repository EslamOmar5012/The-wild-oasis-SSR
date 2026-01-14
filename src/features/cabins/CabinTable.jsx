import { useSearchParams } from "react-router-dom";
import { useCabins } from "../../hooks/useCabins";
import Menus from "../../ui/Menus";

import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import CabinRow from "./CabinRow";
import styled from "styled-components";

const ErrorHeader = styled.h3`
  margin: auto;
`;

function CabinTable() {
  const [isPending, cabins, isError, error] = useCabins();
  const [filterParams] = useSearchParams();

  if (isPending) return <Spinner />;

  if (isError) return <ErrorHeader>{error.message}</ErrorHeader>;

  const filterValue = filterParams.get("discount") || "all";

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
          data={filteredCabins}
          render={(cabin) => <CabinRow key={cabin.id} cabin={cabin}></CabinRow>}
        />
      </Table>
    </Menus>
  );
}

export default CabinTable;
