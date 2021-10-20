import React from "react";
import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { readReservation, updateReservation } from "../utils/api";
import ReservationErrors from "./ReservationError";

function ReservationEdit() {
  const history = useHistory();

  const { reservation_id } = useParams();

  const initialState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  };
  const [error, setError] = useState(null);
  const [reservation, setReservation] = useState(initialState);

  useEffect(() => {
    setError(null);
    readReservation(reservation_id).then(setReservation).catch(setError);
  }, [reservation_id]);

  // Similar to Form index.js from flashcards project:
  function changeHandler({ target: { name, value } }) {
    setReservation((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function changeHandlerNum({ target: { name, value } }) {
    setReservation((prevState) => ({
      ...prevState,
      [name]: Number(value),
    }));
  }

  function validate(reservation) {
    const errors = [];

    function isFutureDate({ reservation_date, reservation_time }) {
      const dt = new Date(`${reservation_date}T${reservation_time}`);
      if (dt < new Date()) {
        errors.push(new Error("Reservation must be set in the future"));
      }
    }

    function isTuesday({ reservation_date }) {
      const day = new Date(reservation_date).getUTCDay();
      if (day === 2) {
        errors.push(new Error("No reservations available on Tuesday."));
      }
    }

    function isOpenHours({ reservation_time }) {
      const hour = parseInt(reservation_time.split(":")[0], 10);
      const mins = parseInt(reservation_time.split(":")[1], 10);

      if (hour <= 10 && mins <= 30) {
        errors.push(new Error("Restaurant is only open after 10:30 am"));
      }

      if (hour >= 22) {
        errors.push(new Error("Restaurant is closed after 10:00 pm"));
      }
    }

    isFutureDate(reservation);
    isTuesday(reservation);
    isOpenHours(reservation);

    return errors;
  }

  function submitHandler(event) {
    event.preventDefault();
    event.stopPropagation();

    const reservationErrors = validate(reservation);

    console.log(reservationErrors);
    if (reservationErrors.length) {
      return setError(reservationErrors);
    }

    updateReservation({ reservation_id, ...reservation }).then(
      (updatedReservation) => {
        const res_date =
          updatedReservation.reservation_date.match(/\d{4}-\d{2}-\d{2}/)[0];
        history.push(`/dashboard?date=` + res_date);
      }
    );
  }

  return (
    <form onSubmit={submitHandler}>
      <ReservationErrors errors={error} />
      <div className="form-group row">
        <label className="col-sm-2 col-form-label">First name:</label>
        <div className="col-sm-10">
          <input
            name="first_name"
            value={reservation.first_name}
            onChange={changeHandler}
          />
        </div>
      </div>
      <div className="form-group row">
        <label className="col-sm-2 col-form-label">Last name:</label>
        <div className="col-sm-10">
          <input
            name="last_name"
            value={reservation.last_name}
            onChange={changeHandler}
          />
        </div>
      </div>
      <div className="form-group row">
        <label className="col-sm-2 col-form-label">Mobile Number:</label>
        <div className="col-sm-10">
          <input
            name="mobile_number"
            type="tel"
            value={reservation.mobile_number}
            onChange={changeHandler}
          />
        </div>
      </div>
      <div className="form-group row">
        <label className="col-sm-2 col-form-label">Reservation Date:</label>
        <div className="col-sm-10">
          <input
            name="reservation_date"
            type="date"
            value={reservation.reservation_date}
            onChange={changeHandler}
          />
        </div>
      </div>
      <div className="form-group row">
        <label className="col-sm-2 col-form-label">Time:</label>
        <div className="col-sm-10">
          <input
            name="reservation_time"
            type="time"
            value={reservation.reservation_time}
            onChange={changeHandler}
          />
        </div>
      </div>
      <div className="form-group row">
        <label className="col-sm-2 col-form-label">Number of people:</label>
        <div className="col-sm-10">
          <input
            name="people"
            type="number"
            min={1}
            value={reservation.people}
            onChange={changeHandlerNum}
          />
        </div>
      </div>
      <button type="submit">Submit</button>
      <button type="button" onClick={() => history.goBack()}>
        Cancel
      </button>
    </form>
  );
}

export default ReservationEdit;
