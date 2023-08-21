const express = require("express");
const fs = require("fs");
const port = 3000;

const app = express();
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "/client")));

// todo: get using array
let toDoList = [];

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

app.get("/todos", (req, res) => {
  // using the variable todo list
  // res.send(toDoList);

  // using the json file
  fs.readFile("./files.json", "utf-8", function(err, data) {
    if (!err) console.log(data);
    const json = JSON.parse(data);
    res.send(json);
  });
});

app.post("/todos", (req, res) => {
  // console.log(req.body);

  const toDoObj = {
    id: Math.floor(Math.random() * 100000),
    title: req.body.title,
    description: req.body.description
  };

  // using the variable todo list
  // toDoList.push(toDoObj);
  fs.readFile("./files.json", "utf-8", (err, data) => {
    if (!err) {
      let Data = JSON.parse(data);
      Data.push(toDoObj);
      fs.writeFile("./files.json", JSON.stringify(Data), err => {
        if (err) throw err;
        res.json(toDoObj);
      });
    }
  });
});

function findIndex(arr, id) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) return i;
  }
  return -1;
}

function removeIndex(arr, id) {
  return arr.filter(x => x.id !== id);
}

app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile("./files.json", "utf-8", (err, data) => {
    if (!err) {
      toDoList = JSON.parse(data);
    }
  });

  const index = findIndex(toDoList, id);

  if (index === -1) {
    res.status(404).send("No Such item exists in record.");
  } else {
    toDoList = removeIndex(toDoList, id);
    fs.writeFile("./files.json", JSON.stringify(toDoList), err =>
      console.log(err)
    );
    res.status(200).send(toDoList);
  }
});

app.listen(port, function() {
  console.log(`I am listening on http://localhost:${port}`);
});
