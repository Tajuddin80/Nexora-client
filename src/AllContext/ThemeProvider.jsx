import { useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";

export const ThemeProvider = ({ children }) => {
  // get initial theme from localStorage or fallback to your light theme
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "mycustomlight";
  });

  // apply theme to <html> whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // toggle function
  const toggleTheme = () => {
    setTheme((prev) => (prev === "mycustomlight" ? "mycustomdark" : "mycustomlight"));
  };

  // optional: expose a setter if you want to set a specific theme
  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};