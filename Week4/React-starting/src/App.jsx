import { useState, useEffect } from "react";
import "./App.css";

function useToDo() {
  const [toDo, setToDo] = useState([
    { title: "Gym", description: "Go To Gym" },
    { title: "School", description: "Go To School" }
  ]);

  useEffect(() => {
    async function fetchData() {
      const Fetch = await fetch("http://localhost:3000/todos");
      const data = await Fetch.json();

      setToDo(data);
    }

    const cls = setInterval(() => {
      fetchData();
    }, 1000);

    return () => clearInterval(cls);
  }, []);
  return toDo;
}

function App() {
  const toDo = useToDo();

  return (
    <div>
      {toDo.map(e =>
        <div key={e.key}>
          <h1>
            {e.title}
          </h1>
          <p>
            {e.description}
          </p>
          <br />
        </div>
      )}
    </div>
  );
}

export default App;
