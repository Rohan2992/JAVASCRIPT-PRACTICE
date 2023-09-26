const express = require("express");
const fs = require("fs");
const cors = require("cors");
const port = 3000;

const app = express();
const path = require("path");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "/client")));

// todo: get using array
let toDoList = [];

function findIndex(arr, id) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) return i;
  }
  return -1;
}

function removeIndex(arr, id) {
  return arr.filter(x => x.id !== id);
}

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

app.get("/todos", (req, res) => {
  // using the variable todo list
  // res.send(toDoList);

  // using the json file
  fs.readFile("./files.json", "utf-8", function(err, data) {
    if (err) console.log(err);
    const json = JSON.parse(data);
    res.send(json);
  });
});

app.post("/todos", (req, res) => {
  if (req.body.title == "" || req.body.description == "") {
    res.send("Bad Request sent fields cannot be empty");
  } else {
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
  }
});

app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile("./files.json", "utf-8", (err, data) => {
    if (!err) {
      toDoList = JSON.parse(data);
    }
  });

  const index = findIndex(toDoList, id);

  if (index !== -1) {
    toDoList = removeIndex(toDoList, id);
    fs.writeFile("./files.json", JSON.stringify(toDoList), err =>
      console.log(err)
    );
    res.status(200).send(toDoList);
  } else {
    res.status(404).json("No Such item exists in record.");
  }
});

app.listen(port, function() {
  console.log(`I am listening on http://localhost:${port}`);
});
