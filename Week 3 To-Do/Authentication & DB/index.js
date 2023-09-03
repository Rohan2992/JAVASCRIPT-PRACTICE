const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let ADMINS;
let USERS;
let COURSES;

const secretKey = "MY_SECRET_KEY";

//functions
function authorizeJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, secretKey, (err, data) => {
      if (err) {
        res.status(403).send({ message: "Authorization failed" });
      }
      req.user = data;
      next();
    });
  } else {
    res.status(401).send({ message: "Authorization failed" });
  }
}

const generateJwt = user => {
  const payload = { username: user.username };
  return jwt.sign(payload, secretKey, { expiresIn: "20m" });
};

function cbListener(port) {
  console.log("Listening on " + port);
}

// Admin Routes
app.post("/admin/signup", (req, res) => {
  const admin = req.body;
  ADMINS = JSON.parse(fs.readFileSync("Admins.json", "utf8"));
  const exsistingAdmin = ADMINS.find(a => a.username === admin.username);

  if (exsistingAdmin) {
    res.status(403).send({ message: "Admin already exists" });
  } else {
    const token = generateJwt(admin);
    ADMINS.push(admin);
    fs.writeFileSync("Admins.json", JSON.stringify(ADMINS));
    res
      .status(201)
      .json({ message: "Admin created successfully", token: token });
  }
});

app.post("/admin/login", (req, res) => {
  const ADMINS = JSON.parse(fs.readFileSync("Admins.json", "utf8"));

  const admin = ADMINS.find(
    a =>
      a.username === req.headers.username && a.password === req.headers.password
  );

  if (admin) {
    const token = generateJwt(req.body);
    res.json({ message: "Logged in successfully", token: token });
  } else {
    res.status(403).send({ message: "Admin does not exist" });
  }
});

app.post("/admin/courses", authorizeJWT, (req, res) => {
  let COURSES = JSON.parse(fs.readFileSync("Courses.json", "utf-8"));
  COURSES.push({ ...req.body, courseId: COURSES.length + 1 });

  fs.writeFileSync("Courses.json", JSON.stringify(COURSES));
  res.status(201).json({
    message: "Course created successfully",
    courseId: COURSES.length
  });
});

app.get("/admin/courses/:courseId", authorizeJWT, (req, res) => {
  const id = parseInt(req.params.courseId);
  const COURSES = JSON.parse(fs.readFileSync("Courses.json", "utf-8"));
  const course = COURSES.find(c => c.courseId === id);
  if (course) {
    res.status(200).json(course);
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.put("/admin/courses/:courseId", authorizeJWT, (req, res) => {
  const id = parseInt(req.params.courseId);
  const COURSES = JSON.parse(fs.readFileSync("Courses.json", "utf-8"));
  const course = COURSES.find(c => c.courseId === id);

  if (course) {
    Object.assign(course, req.body);
    fs.writeFileSync("Courses.json", JSON.stringify(COURSES), "utf-8");
    res.status(200).json({ message: "Course updated successfully", course });
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.get("/admin/courses", authorizeJWT, (req, res) => {
  const COURSES = JSON.parse(fs.readFileSync("Courses.json", "utf-8"));
  res.status(200).json({ courses: COURSES });
});

//user routes

app.post("/users/signup", (req, res) => {
  const USERS = JSON.parse(fs.readFileSync("Users.json", "utf-8"));
  const user = USERS.find(u => u.username === req.body.username);
  if (user) {
    res.status(403).json({ mesage: "User already exists" });
  } else {
    const token = generateJwt(req.body);
    USERS.push({ ...req.body, subscribedCourses: [] });
    fs.writeFileSync("Users.json", JSON.stringify(USERS));
    res.status(201).json({ mesage: "User created successfully", token });
  }
});

app.post("/users/login", (req, res) => {
  const USERS = JSON.parse(fs.readFileSync("Users.json", "utf-8"));
  const user = USERS.find(
    u =>
      u.username === req.headers.username && u.password === req.headers.password
  );
  if (user) {
    const token = generateJwt(req.body);
    res.send({ message: "Logged in successfully", token });
  } else {
    res.status(401).json({ message: "User does not exist" });
  }
});

app.get("/users/courses", authorizeJWT, (req, res) => {
  const COURSES = JSON.parse(fs.readFileSync("Courses.json", "utf-8"));
  const courses = COURSES.filter(c => c.published === "true");
  console.log(req.user);
  res.json(courses);
});

app.post("/users/courses/:courseId", authorizeJWT, (req, res) => {
  const id = parseInt(req.params.courseId);
  const COURSES = JSON.parse(fs.readFileSync("Courses.json", "utf-8"));
  const course = COURSES.find(c => c.courseId === id && c.published === "true");
  if (course) {
    const USERS = JSON.parse(fs.readFileSync("Users.json", "utf-8"));
    console.log(USERS);
    const user = USERS.find(u => u.username === req.user.username);
    console.log(user);
    if (user) {
      if (!user.subscribedCourses) {
        user.subscribedCourses = [];
      }
      user.subscribedCourses.push(course);
      fs.writeFileSync("Users.json", JSON.stringify(USERS));
      res.json({ message: "Course purchased successfully" });
    } else {
      res.status(403).json({ message: "User not found" });
    }
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.get("/users/purchasedCourses", authorizeJWT, (req, res) => {
  const USERS = JSON.parse(fs.readFileSync("Users.json", "utf-8"));
  const user = USERS.find(u => u.username === req.user.username);

  if (user && user.subscribedCourses) {
    res.json({ purchasedCourses: user.subscribedCourses });
  } else {
    res.status(404).json({ message: "No courses purchased" });
  }
});

// listener
app.listen(port, cbListener(port));
