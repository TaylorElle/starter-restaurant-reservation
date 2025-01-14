import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import Dashboard from "../dashboard/Dashboard";
import NewReservation from "../reservations/NewReservation";
import NewTable from "../tables/NewTable";
import ReservationSeat from "../reservations/ReservationSeat";
import Search from "../search/Search";
import ReservationEdit from "../reservations/ReservationEdit";
// import LogIn from "./Login.js";
import { today } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import NotFound from "./NotFound";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const query = useQuery();

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/dashboard">
        <Dashboard date={query.get("date") || today()} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <NewReservation />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/seat">
        <ReservationSeat />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/edit">
        <ReservationEdit />
      </Route>
      <Route exact={true} path="/tables/new">
        <NewTable />
      </Route>
      <Route exact={true} path="/search">
        <Search />
      </Route>
      {/* <Route exact={true} path="/login">
        <LogIn />
      </Route> */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
