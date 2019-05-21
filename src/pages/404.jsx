import React from "react";
import { Link } from "gatsby";

export default () => (
  <div
    style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
    }}
  >
    <span
      style={{
        fontFamily: "$title-font",
        fontSize: "72pt",
      }}
    >
      404 :-(
    </span>
    <br />
    <span
      style={{
        fontSize: "16pt",
      }}
    >
      You are lost.{" "}
      <Link
        to="/"
        style={{
          color: "#fff",
        }}
      >
        Click here to go back.
      </Link>
    </span>
  </div>
);
