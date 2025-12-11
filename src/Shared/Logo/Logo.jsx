import { useEffect, useState } from "react";
import { Link } from "react-router";
import logoLight from "../../assets/whiteLogo.png";
import logoDark from "../../assets/darkLogo.png";

export default function Logo() {
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute("data-theme") || "mycustomlight"
  );

  useEffect(() => {
  
    const observer = new MutationObserver(() => {
      const current = document.documentElement.getAttribute("data-theme");
      setTheme(current);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Link to="/" className="text-xl font-bold inline-flex items-center">
      {theme === "mycustomlight" ? (
        <img
          src={logoLight}
          alt="Logo Light"
          className="rounded-md h-8 sm:h-10 md:h-12"
        />
      ) : (
        <img
          src={logoDark}
          alt="Logo Dark"
          className="rounded-md h-8 sm:h-10 md:h-12"
        />
      )}
    </Link>
  );
}
