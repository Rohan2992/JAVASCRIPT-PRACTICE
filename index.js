const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

const middleware = (req, res, next) => {
  console.log(" i am a middleware");
  next();
};

// app.use(middleware);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

function calculateSum(range) {
  let sum = 0;

  for (var i = 1; i <= 5; i++) {
    sum += i;
  }
  return sum;
}

function calculateMul(range) {
  let sum = 1;

  for (var i = 1; i <= 5; i++) {
    sum *= i;
  }
  return sum;
}

function startListening() {
  console.log(`I am Listening on http://localhost:${port}`);
}

app.get("/", middleware, homeRoute);

app.listen(port, startListening);

function homeRoute(req, res) {
  // console.log(req.query)   // for query params
  // console.log(req.headers) // for headers

  // console.log(req.body);
  console.log(" I am Home Route");

  const jsonObj = {
    sum: calculateSum(req.body.counter),
    mul: calculateMul(req.body.counter)
  };
  // res.sendFile(__dirname + "/index.html");
  res.send(
    `The sum of ${req.body.counter} is ${calculateSum(req.body.counter)}`
  );
}
// const express = require("express");
// var bodyParser = require("body-parser");
// const multer = require("multer");
// const upload = multer(); // config
// const app = express();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(upload.any());
// const port = 3000;

// // app.use(express.urlencoded({ extended: true }));
// // app.use(express.json());

// // console.log(calculateSum(100));

// function homeRoute(req, res) {
//   // console.log(req.query);
//   // console.log(req.params);
//   const obj = JSON.parse(JSON.stringify(req.body));
//   console.log(obj);
//   res.send(
//     `The Sum of first 100 terms is : ${calculateSum(parseInt(obj.counter))}`
//   );
// }

// function homeRoutePost(req, res) {
//   console.log(req.body);
//   console.log(parseInt("123"));
//   res.send("I am the Post request...");
// }

// app.get("/", homeRoute);
// app.post("/", homeRoute);
// // app.get("/counter/:id", homeRoutePost);

// function startListening() {
//   console.log(`Server is running on https://localhost:${port}`);
// }

// app.listen(port, startListening);
