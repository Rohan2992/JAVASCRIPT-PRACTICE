# Week 3.1 Finishing backend, starting frontend

    - Callback function using
        - passing functions
        - passing anonymous function
        - using arrow functions

    - Make To-Do and its apis

### using a variable to store the data

    - while seding data from front-end to backend via post request we use
    ```
     headers: { "Content-Type": "application/json" }
    ```
    - As we can send xml and json both, it tells that what string we are sending has to be interpreted as a JSON.
    - when we send , we always send a string.
    - while serving static files we use
    ``` app.use(express.static(path.join(__dirname, "..", "/client"))) ```
    - It doesn't contains the exact path, but contains the path to the folder, where the file is located

### using a JSON file to store the data

    - The data to be send to back-end is send in the form of string.
    - As files always send and receive data in the form of string.
    - JSON.parse("string") and JSON.stringify(obj) methods are used..
