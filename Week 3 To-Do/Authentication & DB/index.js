const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let ADMIN = [];
let USERS = [];
let COURSES = [];
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
  const exsistingAdmin = ADMIN.find(a => a.username === admin.username);
  // console.log(exsistingAdmin);

  if (exsistingAdmin) {
    res.status(403).send({ message: "Admin already exists" });
  } else {
    const token = generateJwt(admin);
    ADMIN.push(admin);
    res
      .status(201)
      .json({ message: "Admin created successfully", token: token });
  }
});

app.post("/admin/login", (req, res) => {
  const token = generateJwt(req.body);
  res.json({ message: "Logged in successfully", token: token });
});

app.post("/admin/courses", authorizeJWT, (req, res) => {
  COURSES.push({ ...req.body, courseId: COURSES.length + 1 });

  res.status(201).json({
    message: "Course created successfully",
    courseId: COURSES.length
  });
});

app.get("/admin/courses/:courseId", authorizeJWT, (req, res) => {
  const id = parseInt(req.params.courseId);

  const course = COURSES.find(c => c.courseId === id);
  if (course) {
    res.status(200).json(course);
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.put("/admin/courses/:courseId", authorizeJWT, (req, res) => {
  const id = parseInt(req.params.courseId);

  const course = COURSES.find(c => c.courseId === id);
  if (course) {
    Object.assign(course, req.body);
    res.status(200).json({ message: "Course updated successfully", course });
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.get("/admin/courses", authorizeJWT, (req, res) => {
  res.status(200).json({ courses: COURSES });
});

//user routes

app.post("/users/signup", (req, res) => {
  const user = USERS.find(u => u.username === req.body.username);
  if (user) {
    res.status(403).json({ mesage: "User already exists" });
  } else {
    const token = generateJwt(req.body);
    USERS.push({ ...req.body, subscribedCourses: [] });
    res.status(201).json({ mesage: "User created successfully", token });
  }
});

app.post("/users/login", authorizeJWT, (req, res) => {
  const token = generateJwt(req.body);
  res.send({ message: "Logged in successfully", token });
});

app.get("/users/courses", authorizeJWT, (req, res) => {
  const courses = COURSES.filter(c => c.published === "true");
  res.json(courses);
});

app.post("/users/courses/:courseId", authorizeJWT, (req, res) => {
  const id = parseInt(req.params.courseId);

  const course = COURSES.find(c => c.courseId === id && c.published === "true");
  if (course) {
    const user = USERS.find(u => u.username === req.user.username);
    if (user) {
      if (!user.subscribedCourses) {
        user.subscribedCourses = [];
      }
      user.subscribedCourses.push(course);
      res.json({ message: "Course purchased successfully" });
    } else {
      res.status(403).json({ message: "User not found" });
    }
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.get("/users/purchasedCourses", authorizeJWT, (req, res) => {
  const user = USERS.find(u => u.username === req.user.username);

  if (user && user.subscribedCourses) {
    res.json({ purchasedCourses: user.subscribedCourses });
  } else {
    res.status(404).json({ message: "No courses purchased" });
  }
});

// listener
app.listen(port, cbListener(port));
