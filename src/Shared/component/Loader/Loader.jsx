import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

const Loader = ({ loading = true, size = 80 }) => {
  const [primaryColor, setPrimaryColor] = useState("#B8001F");

  useEffect(() => {
    const root = document.documentElement;

    const updateColor = () => {
      const newColor = getComputedStyle(root)
        .getPropertyValue("--color-primary")
        .trim();
      setPrimaryColor(newColor);
    };

    updateColor();

    const observer = new MutationObserver(updateColor);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: primaryColor,
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-base-100">
      <ClipLoader
        color={primaryColor}
        loading={loading}
        cssOverride={override}
        size={size}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Loader;
