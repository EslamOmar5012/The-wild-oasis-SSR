import { useState } from "react";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import CabinTable from "../features/cabins/CabinTable";
import Button from "../ui/Button";
import CreateCabinForm from "../features/cabins/CreateCabinForm";

function Cabins() {
  const [showForm, setShowForm] = useState(false);

  const hideForm = () => {
    setShowForm(false);
  };
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All cabins</Heading>
        <p>filter / sort</p>
      </Row>

      <Row type="vertical">
        <CabinTable />
        <Button
          onClick={() => setShowForm((prev) => !prev)}
          $size="large"
          $variation="primary"
        >
          Add new cabin
        </Button>
        {showForm && <CreateCabinForm hideForm={hideForm} />}
      </Row>
    </>
  );
}

export default Cabins;
