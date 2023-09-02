const express = require("express");
const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let ADMIN = [];
let USERS = [];
let COURSES = [];

// Functions
function authorizeAdmin(req, res, next) {
  const { username, password } = req.headers;
  const isAuthorized = ADMIN.find(
    a => a.username === username && a.password === password
  );
  if (isAuthorized) {
    next();
  } else {
    res.status(403).send({ message: "Admin authentication failed" });
  }
}

function authorizeUser(req, res, next) {
  const { username, password } = req.headers;

  const user = USERS.find(
    u => u.username === username && u.password === password
  );
  if (user) {
    req.user = user;
    next();
  } else {
    res.status(403).json({ message: "User authentication failed" });
  }
}

function cbListener(port) {
  console.log("Listening on " + port);
}

// Admin Routes
app.post("/admin/signup", (req, res) => {
  const admin = req.body;
  const exsistingAdmin = ADMIN.find(a => a.username === admin.username);
  // console.log(exsistingAdmin);

  if (exsistingAdmin) {
    res.status(403).send({ message: "Admin already exists" });
  } else {
    ADMIN.push(admin);
    res.status(401).json({ message: "Admin created successfully" });
  }
});

app.post("/admin/login", authorizeAdmin, (req, res) => {
  res.json({ message: "Logged in successfully" });
});

app.post("/admin/courses", authorizeAdmin, (req, res) => {
  COURSES.push({ ...req.body, courseId: COURSES.length + 1 });

  res.status(201).json({
    message: "Course created successfully",
    courseId: COURSES.length
  });
});

app.get("/admin/courses/:courseId", authorizeAdmin, (req, res) => {
  const id = parseInt(req.params.courseId);

  const course = COURSES.find(c => c.courseId === id);
  if (course) {
    res.status(200).json(course);
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.put("/admin/courses/:courseId", authorizeAdmin, (req, res) => {
  const id = parseInt(req.params.courseId);

  const course = COURSES.find(c => c.courseId === id);
  if (course) {
    Object.assign(course, req.body);
    res.status(200).json({ message: "Course updated successfully", course });
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.get("/admin/courses", authorizeAdmin, (req, res) => {
  res.status(200).json({ courses: COURSES });
});

//user routes

app.post("/users/signup", (req, res) => {
  const user = USERS.find(u => u.username === req.body.username);
  if (user) {
    res.status(403).json({ mesage: "User already exists" });
  } else {
    USERS.push({ ...req.body, subscribedCourses: [] });
    res.status(201).json({ mesage: "User created successfully" });
  }
});
app.post("/users/login", authorizeUser, (req, res) => {
  res.send({ message: "Logged in successfully" });
});
app.get("/users/courses", authorizeUser, (req, res) => {
  const courses = COURSES.filter(c => c.published === "true");
  res.json(courses);
});
app.post("/users/courses/:courseId", authorizeUser, (req, res) => {
  const id = parseInt(req.params.courseId);

  const course = COURSES.find(c => c.courseId === id && c.published === "true");
  if (course) {
    req.user.subscribedCourses.push(id);
    res.json({ message: "Course purchased successfully" });
  } else {
    res.status(404).json({ message: "Course not found or not available" });
  }
});
app.get("/users/purchasedCourses", authorizeUser, (req, res) => {
  const purchasedCoursesIdx = req.user.subscribedCourses;
  const purchasedCourses = [];
  for (let i = 0; i < COURSES.length; i++) {
    if (purchasedCoursesIdx.indexOf(COURSES[i].courseId) !== -1) {
      purchasedCourses.push(COURSES[i]);
    }
  }
  res.json({ courses: purchasedCourses });
});

// listener
app.listen(port, cbListener(port));
