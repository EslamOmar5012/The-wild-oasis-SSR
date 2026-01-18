import styled from "styled-components";
import BookingDataBox from "../../features/bookings/BookingDataBox";
import CheckBox from "../../ui/Checkbox";

import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import Spinner from "../../ui/Spinner.jsx";

import { useMoveBack } from "../../hooks/useMoveBack";
import { useBooking } from "../../hooks/useBooking";
import { useEffect, useState } from "react";
import ErrorHeader from "../../ui/ErrorHeader.jsx";

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckinBooking() {
  const [confirmPaid, setConfirmPaid] = useState(false);

  const moveBack = useMoveBack();

  const [isLoading, booking, error] = useBooking();

  useEffect(() => {
    function handleConfirm() {
      console.log(booking?.isPaid);
      setConfirmPaid(booking?.isPaid ?? false);
    }

    handleConfirm();
  }, [booking, setConfirmPaid]);

  function handleCheckin() {}

  if (isLoading) return <Spinner />;

  if (error) return <ErrorHeader>{error.message}</ErrorHeader>;

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Check in booking #{booking.id}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      <Box>
        <CheckBox
          checked={confirmPaid}
          onChange={() => setConfirmPaid((confirm) => !confirm)}
          id="confirm"
          disabled={confirmPaid}
        >
          I confirm that {booking.guests.fullName} has paid the total amount
        </CheckBox>
      </Box>

      <ButtonGroup>
        <Button $variation="primary" $size="medium" onClick={handleCheckin}>
          Check in booking #{booking.id}
        </Button>
        <Button $variation="secondary" $size="medium" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;
