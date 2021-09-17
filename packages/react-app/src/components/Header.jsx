import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a target="_blank" rel="noopener noreferrer">
      <PageHeader
        title="🚘 DeRi"
        subTitle="Degen Rides"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
