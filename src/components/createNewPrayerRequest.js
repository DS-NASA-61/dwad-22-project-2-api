import React from "react";
import DatePickerFunc from "./datePicker";

// import MultiselectPrayFor from "./multiselectPrayerFor";
// import MultiselectPrayerTopic from "./multiselectPrayerTopic";

export default function createNewPrayerRequest(props) {
  return (
    <React.Fragment>
      <form
        className="container"
        style={{ width: "40rem", padding: "1rem", border: "solid grey 0.5px" }}
      >
        <div className="row">
          <h5>Welcome to The Safe Space Prayer Wall</h5>
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              name="newRequested_by"
              value={props.newRequested_by}
              onChange={props.onUpdateFormField}
            />
          </div>
          <div class="col">
            <input
              type="text"
              className="form-control"
              placeholder="Email"
              name="newRequested_by_email"
              value={props.newRequested_by_email}
              onChange={props.onUpdateFormField}
            />
          </div>
        </div>

        <div
          className="row"
          style={{ marginTop: "1rem", marginBottom: "1rem" }}
        >
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Title"
              name="newTitle"
              value={props.newTitle}
              onChange={props.onUpdateFormField}
            />
          </div>
          <div class="col">
            <DatePickerFunc />
          </div>
        </div>

        <div
          className="row"
          style={{ marginTop: "1rem", marginBottom: "1rem" }}
        >
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Prayer Topic"
              name="newPrayer_topic"
              value={props.newPrayer_topic}
              onChange={props.onUpdateFormField}
            />
            {/* <MultiselectPrayerTopic
              options={props.prayerTopicOptions}
              onSelect={props.onSelect}
            /> */}
          </div>
          <div class="col">
            <input
              type="text"
              className="form-control"
              placeholder="Pray For"
              name="newPray_for"
              value={props.newPray_for}
              onChange={props.onUpdateFormField}
            />
            {/* <MultiselectPrayFor
              options={props.prayForOptions}
              onSelect={props.onSelect}
            /> */}
          </div>
        </div>

        <div className="mb-3">
          <textarea
            className="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
            placeholder="Prayer Request: 300 character max."
            name="newPrayerRequestContent"
            value={props.newPrayerRequestContent}
            onChange={props.onUpdateFormField}
          ></textarea>
        </div>

        <div className="row">
          <div class="col-12 d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary mb-3"
              onClick={props.onAddNewPrayerRequest}
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </React.Fragment>
  );
}
