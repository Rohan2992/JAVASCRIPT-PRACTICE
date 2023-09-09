import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [toDo, setToDo] = useState([
    { title: "Gym", description: "Go To Gym" },
    { title: "School", description: "Go To School" }
  ]);
  useEffect(async () => {
    console.log("Inside useEffect");
  }, []);
  console.log("render");

  return (
    <div>
    {toDo.map((e)=>{
      return (
        <>
        <h1>
        {e.title}
      </h1>
      <p>
        {e.description}
      </p>
      <br />
      </>
) 
    })}
            
    </div>
  );
}

export default App;
