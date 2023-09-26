const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 3000;
const url = "mongodb://127.0.0.1:27017/";
const dbName = "CourseSellingDB";

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const secretKey = "MY_SECRET_KEY";

mongoose
  .connect(url + dbName)
  .then(() => {
    console.log("Connection established successfully");
  })
  .catch(err => console.error(err));

const AdminSchema = mongoose.Schema({ username: String, password: String });
const UserSchema = mongoose.Schema({
  username: String,
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }]
});
const CourseSchema = mongoose.Schema({
  title: String,
  description: String,
  published: Boolean
});

const Admin = mongoose.model("Admin", AdminSchema);
const User = mongoose.model("User", UserSchema);
const Course = mongoose.model("Course", CourseSchema);
//functions
function authorizeJWT(req, res, next) {
  // console.log(req.headers.authorization);
  if (req.headers.authorization !== undefined) {
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
}

const generateJwt = user => {
  const payload = { username: user.username };
  return jwt.sign(payload, secretKey, { expiresIn: "2h" });
};

function cbListener(port) {
  console.log("Listening on " + port);
}

// Admin Routes
app.post("/admin/signup", async (req, res) => {
  const { username } = req.body;

  const exsistingAdmin = await Admin.findOne({ username });

  if (exsistingAdmin) {
    res.status(403).send({ message: "Admin already exists" });
  } else {
    const token = generateJwt(req.body);
    const admin = new Admin(req.body);
    await admin.save();
    res
      .status(201)
      .json({ message: "Admin created successfully", token: token });
  }
});

app.get("/admin/me", authorizeJWT, (req, res) => {
  // console.table(req.user);
  if (req.user !== undefined) {
    {
      res.json({ user: req.user.username });
    }
  }
});

app.post("/admin/login", async (req, res) => {
  const { username, password } = req.headers;
  const admin = await Admin.findOne({ username, password });

  if (admin) {
    const token = generateJwt({ username });
    res.json({ message: "Logged in successfully", token: token });
  } else {
    res.status(403).send({ message: "Admin does not exist" });
  }
});

app.post("/admin/courses", authorizeJWT, async (req, res) => {
  const courseExists = await Course.findOne({ title: req.body.title });

  if (courseExists) {
    res.send({ message: "Course already exists and cannot be created" });
  } else {
    const course = new Course(req.body);
    await course.save();

    res.status(201).json({
      message: "Course created successfully",
      course: course
    });
  }
});

app.get("/admin/courses/:courseId", authorizeJWT, async (req, res) => {
  const id = req.params.courseId;
  const course = await Course.findById(id);
  if (course) {
    res.status(200).send(course);
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.put("/admin/courses/:courseId", authorizeJWT, async (req, res) => {
  const id = req.params.courseId;
  const course = await Course.findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true }
  );
  // console.log(course);
  if (course) {
    res.status(200).json({ message: "Course updated successfully", course });
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.get("/admin/courses", authorizeJWT, async (req, res) => {
  const COURSES = await Course.find();
  res.status(200).json({ courses: COURSES });
});

// //user routes

app.post("/users/signup", async (req, res) => {
  const { username } = req.body;
  const user = await User.findOne({ username });

  if (user) {
    res.status(403).json({ mesage: "User already exists" });
  } else {
    const token = generateJwt(req.body);
    const newUser = new User({ ...req.body, subscribedCourses: [] });
    await newUser.save();
    res.status(201).json({ mesage: "User created successfully", token });
  }
});

app.post("/users/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    const token = generateJwt(req.body);
    res.send({ message: "Logged in successfully", token });
  } else {
    res.status(401).json({ message: "User does not exist" });
  }
});

app.get("/users/courses", authorizeJWT, async (req, res) => {
  const courses = await Course.find({ published: true });
  //   console.log(req.user);
  res.json(courses);
});

app.post("/users/courses/:courseId", authorizeJWT, async (req, res) => {
  // const course = await Course.findById(req.params.courseId);
  // console.log(course);
  // if (course) {
  //   const user = await User.findOne({ username: req.user.username });
  //   if (user) {
  //     user.purchasedCourses.push(course);
  //     await user.save();
  //     res.json({ message: "Course purchased successfully" });
  //   } else {
  //     res.status(403).json({ message: "User not found" });
  //   }
  // } else {
  //   res.status(404).json({ message: "Course not found" });
  // }

  const id = req.params.courseId;
  const course = await Course.findById(req.params.courseId);
  // console.log(course);
  if (course) {
    const user = await User.findOne({ username: req.user.username });
    let flag = false;
    // console.log(user.purchasedCourses);

    // Do something with the referencedDocument
    for (const refId of user.purchasedCourses) {
      if (refId.equals(id)) {
        flag = true;
      }
    }
    if (user && !flag) {
      user.purchasedCourses.push(course);
      await user.save();
      res.json({ message: "Course purchased successfully" });
    } else {
      res
        .status(403)
        .json({ message: "Either User not found or Course already exists" });
    }
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.get("/users/purchasedCourses", authorizeJWT, async (req, res) => {
  const user = await User.findOne({ username: req.user.username }).populate(
    "purchasedCourses"
  );
  if (user) {
    res.json({ purchasedCourses: user.purchasedCourses || [] });
  } else {
    res.status(403).json({ message: "User not found" });
  }
});

// listener
app.listen(port, cbListener(port));
