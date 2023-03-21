import React from "react";
import Multiselect from "multiselect-react-dropdown";

export default function multiselectPrayerTopic(props) {
  return (
    <React.Fragment>
      <Multiselect
        placeholder="Prayer Topic"
        isObject={false}
        options={props.options}
        onSelect={props.onSelect}
        onRemove={props.onRemove}
      />
    </React.Fragment>
  );
}
