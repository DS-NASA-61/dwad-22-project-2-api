import React from "react";
import { FcBusinesswoman } from "react-icons/fc";
import { FaEdit } from "react-icons/fa";
import { FaBible } from "react-icons/fa";
import { FaTimesCircle } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaPray } from "react-icons/fa";

export default function prayerRequests(props) {
  return (
    <React.Fragment>
      <div id="all-prayerRequest">
        {/* optional chaining : "?"  */}
        {props.data.requests?.map((prayerRequest) => {
          console.log(prayerRequest);
          return (
            <div
              className="card mt-3"
              style={{ borderColor: "#FAFAFA" }}
              key={prayerRequest._id}
            >
              <div className="card-body">
                <div className="container">
                  <div className="row">
                    <div className="row">
                      <h5 className="card-title text-start col-11">
                        {prayerRequest.title}
                      </h5>
                      <div className="col">
                        <FaEdit className="me-2" style={{ color: "#55BB8E" }} />
                        <FaTimesCircle style={{ color: "#550C18" }} />
                      </div>
                    </div>

                    <div className="card-text">
                      <ul
                        className="text-start fst-italic"
                        style={{ padding: "1.5rem" }}
                      >
                        {prayerRequest.content}
                      </ul>
                    </div>
                    <p className="card-title text-start col mb-0">
                      <FcBusinesswoman className="me-1" />
                      {prayerRequest.user.username}{" "}
                      <span style={{ fontSize: "small" }}>
                        needs your prayers for
                      </span>
                    </p>
                    <p
                      className="card-title text-start mb-0"
                      style={{ fontSize: "small" }}
                    >
                      <FaPray className="me-1" style={{ color: "#55BB8E" }} />{" "}
                      {prayerRequest.pray_for}
                    </p>
                    <p
                      className="card-title text-start mb-0 col"
                      style={{ fontSize: "small" }}
                    >
                      <FaBible className="me-1" style={{ color: "#55BB8E" }} />{" "}
                      {prayerRequest.prayer_topic}
                    </p>
                    <p
                      className="card-title text-start mb-0 col"
                      style={{ fontSize: "small" }}
                    >
                      <FaCalendarAlt /> {prayerRequest.date}
                    </p>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      style={{
                        width: "7rem",
                      }}
                    >
                      Gimme a hug
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm me-5"
                      style={{
                        width: "6rem",
                      }}
                    >
                      Pray for me
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
}
