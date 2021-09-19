import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <PageHeader
      title="🚘 DeRi"
      subTitle="Degen Rides"
      style={{ cursor: "pointer" }}
    />
  );
}
