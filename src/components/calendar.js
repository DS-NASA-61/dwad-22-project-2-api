import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function ReactCalendar(props) {
  return (
    <React.Fragment>
      <div>
        <Calendar onChange={props.changeDate} value={props.date} />
      </div>
    </React.Fragment>
  );
}
