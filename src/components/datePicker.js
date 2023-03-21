import React, { useState } from "react";

export default function DatePickerFunc() {
  const [date, setDate] = useState();
  return (
    <input
      type="date"
      onChange={(e) => setDate(e.target.value)}
      className="form-control"
      style={{ color: "grey" }}
    />
  );
}
