import React from "react";
import { Link } from "react-router";

export default function Logo() {
  return (
    <Link
      to="/"
      className="text-2xl font-black uppercase tracking-widest transition-opacity flex items-center gap-1"
    >
      NEXORA
    </Link>
  );
}
