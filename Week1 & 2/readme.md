# web development

    - Frontend
    - Backend
    - Middleware

## Backend

    - Http Server
    - Authentication
    - Database
    - Middleware

### Http Server

    - Allows us to send and receive HTTP requests
    - creates http server using Express
    - Consists of url, host and port

### Middleware

    - Middleware are function that can capture requests and have the ability to interrupt the request-response cycle as they have access to the request object as well as the response object..
    - used using the app.use(middleware) in express
    - To call on a specific route we send middleware as the second argument in the route
    - next is used to call the route, else the request is left hanging in the middleware.
    - It also allows to implement any logic globally

### Ways to send data to backend

    - There are **3** ways to send data to backend
        1. query parameters
        2. using Headers
        3. using Body(body-parser is reqd.)
    - To send files to backend we use multer as additional middleware.

### Different servers can also communicate with each other with the help of fetch/axios.

    ``` const a = fetch("http://localhost:3000");
    a.then(response => response.json()).then(data => console.log(data)); ```

    - we can also link frontend to backend either using cors or setting up the proxy.

### Response send to browser by server

    - Body
    - Headers
    - status code

