import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

const Startup = () => {
  const [html, setHTML] = useState({ __html: "" });
  useEffect(() => {
    fetch("http://localhost:3000/")
      .then(response => response.text())
      .then(data => setHTML({ __html: data }));
  }, []);
  return <div dangerouslySetInnerHTML={html} />;
};

const root = createRoot(document.getElementById("root"));
root.render(<Startup />);
