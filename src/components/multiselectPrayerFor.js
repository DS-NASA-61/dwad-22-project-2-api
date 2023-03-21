import React from "react";
import Multiselect from "multiselect-react-dropdown";

export default function multiselectPrayFor(props) {
  return (
    <React.Fragment>
      <Multiselect
        placeholder="Pray For"
        isObject={false}
        options={props.options}
        onSelect={props.onSelect}
        onRemove={props.onRemove}
      />
    </React.Fragment>
  );
}
