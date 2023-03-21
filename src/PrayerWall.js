import React from "react";
import axios from "axios";
import ReactCalendar from "./components/calendar";
import CreateNewPrayerRequest from "./components/createNewPrayerRequest";
import PrayerRequests from "./components/prayerRequests";
import MultiselectPrayFor from "./components/multiselectPrayerFor";
import MultiselectPrayerTopic from "./components/multiselectPrayerTopic";

//!!!important note: in JSX, components are used with captial first letter, otherwise cannot be recongnized as JSX hence cannot render

export default class PrayerWall extends React.Component {
  BASE_API_URL = "http://localhost:4000/";

  state = {
    active: "prayerRequests",
    data: [],

    date: new Date(), //for the Calendar Library
    showPrayerRequestForm: false,
    //below state are for filters in side pannel
    prayerTopicOptions: [
      "Spiritual Growth",
      "Relationships",
      "Healing",
      "Peace",
      "Gratitude",
      "Forgiveness",
      "Grief",
      "Provision",
      "Wisdom",
      "Others",
    ],
    prayForOptions: [
      "Church",
      "Cellgroup",
      "Family",
      "Myself",
      "Friends",
      "Workplace",
      "School",
      "World Issues",
      "Others",
    ],
    selectedPrayerTopics: [], //for multiselect
    selectedPrayerFor: [], //for multiselect
    searchTitle: "",
    searchUserEmail: "",

    newRequested_by: "", //same as user.username
    newRequested_by_email: "", //same as user.user_email
    newTitle: "",
    newDate: "",
    newPrayer_topic: "",
    newPray_for: "",
    newPrayerRequestContent: "",

    newAnswered: false,
  };

  componentDidMount = async () => {
    const response = await axios.get(this.BASE_API_URL + "prayer_request");
    this.setState({
      data: response.data,
    });

    // console.log(response.data);
  };

  setTrueFalse = () => {
    this.setState({ showPrayerRequestForm: true });
  };

  setActive = (page) => {
    this.setState({
      active: page,
    });
  };

  updateFormField = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  // must be async function to add the new PrayerRequest to the mongo database.
  addNewPrayerRequest = async () => {
    let response = await axios.post(this.BASE_API_URL + "prayer_request", {
      title: this.state.newTitle,
      prayer_topic: this.state.newPrayer_topic,
      pray_for: this.state.newPray_for,
      content: this.state.newPrayerRequestContent,
      user: {
        username: this.state.newRequested_by,
        user_email: this.state.newRequested_by_email,
      },
    });

    this.setState({
      data: [...this.state.data, response.data[0]],
      active: "prayerRequests",
    });
  };

  changeDate = (date) => {
    this.setState({ date });
  };

  //methods for multiselect
  //similar concept as handling checkboxes: modify array in React
  updateMultiSelectPrayerTopics = (selectedItem) => {
    // should not usd const modified = [...this.state.selectedValues, selectedItem];
    // because spread operator will crate a new array and result in returning an array of arrays
    this.setState({
      selectedPrayerTopics: selectedItem,
    });
  };
  removeMultiSelectPrayerTopics = () => {
    this.setState({ selectedPrayerTopics: [] });
  };

  updateMultiSelectPrayerFor = (selectedItem) => {
    // should not usd const modified = [...this.state.selectedValues, selectedItem];
    // because spread operator will crate a new array and result in returning an array of arrays
    this.setState({
      selectedPrayerFor: selectedItem,
    });
  };
  removeMultiSelectPrayerFor = () => {
    this.setState({ selectedPrayerFor: [] });
  };

  //add onChange handler for the title when creating new prayer request
  inputTitle = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  filterSearch = async () => {
    const response = await axios.get(this.BASE_API_URL + "prayer_request", {
      params: {
        title: this.state.searchTitle,
        prayer_topic: this.state.selectedPrayerTopics,
        pray_for: this.state.selectedPrayerFor,
        user_email: this.state.searchUserEmail,
      },
    });

    console.log(response.data);

    this.setState({ data: response.data });
  };

  renderContent() {
    if (this.state.data.legnth === 0) {
      return null;
    } else {
      if (this.state.active === "prayerRequests") {
        return <PrayerRequests data={this.state.data} />;
      } else if (this.state.active === "createNewPrayerRequest") {
        return <CreateNewPrayerRequest />;
      }
    }
  }

  renderNewPrayerRequestForm() {
    if (this.state.showPrayerRequestForm === false) {
      return <React.Fragment></React.Fragment>;
    } else if (this.state.showPrayerRequestForm === true) {
      return (
        <React.Fragment>
          <CreateNewPrayerRequest
            onUpdateFormField={this.updateFormField}
            onAddNewPrayerRequest={this.addNewPrayerRequest}
            newRequested_by={this.state.newRequested_by}
            newRequested_by_email={this.state.newRequested_by_email}
            newTitle={this.state.newTitle}
            newPrayer_topic={this.state.newPrayer_topic}
            newPray_for={this.state.newPray_for}
            newPrayerRequestContent={this.state.newPrayerRequestContent}
          />
        </React.Fragment>
      );
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="container">
          <div style={{ height: "20px" }}></div>
          <div className="row" style={{ margin: "1rem" }}>
            <div className="col col-lg-3 text-start">
              <button className="btn btn-primary btn-sm">HOME</button>
            </div>
            <div class="col text-end">
              <button className="btn btn-primary btn-sm">ABOUT US</button>
            </div>
          </div>

          <div className="row">
            <section
              id="side_pannel"
              className="col col-lg-3"
              style={{ border: "solid 1px black" }}
            >
              <header>
                <h>place holder for a caption here</h>
              </header>
              <div>
                <ReactCalendar
                  onChange={this.changeDate}
                  value={this.state.date}
                />
              </div>
              {/* side pannel filters */}
              <div>
                <h5 style={{ marginTop: "1rem" }}>Search Area</h5>
                <div style={{ marginTop: "1rem" }}>
                  <MultiselectPrayerTopic
                    options={this.state.prayerTopicOptions}
                    onSelect={this.updateMultiSelectPrayerTopics}
                    onRemove={this.removeMultiSelectPrayerTopics}
                  />
                </div>
                <div style={{ marginTop: "1rem" }}>
                  <MultiselectPrayFor
                    options={this.state.prayForOptions}
                    onSelect={this.updateMultiSelectPrayerFor}
                    onRemove={this.removeMultiSelectPrayerFor}
                  />
                </div>
                <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search Title"
                    name="searchTitle"
                    value={this.state.searchTitle}
                    onChange={this.updateFormField}
                  />
                </div>
                <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Created by (email) "
                    name="searchUser"
                    value={this.state.searchUserEmail}
                    onChange={this.updateFormField}
                  />
                </div>
                <div>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ margin: "1rem" }}
                    onClick={this.filterSearch}
                  >
                    SEARCH
                  </button>
                </div>
              </div>
            </section>

            <section className="col" id="prayerwall">
              <header>
                <h1>My Prayer Wall</h1>
              </header>
              <button
                className="btn btn-primary btn-sm"
                style={{ margin: "1rem" }}
                onClick={this.setTrueFalse}
              >
                SHARE YOUR PRAYER REQUEST
              </button>
              <div>{this.renderNewPrayerRequestForm()}</div>
              <div>{this.renderContent()}</div>
            </section>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
