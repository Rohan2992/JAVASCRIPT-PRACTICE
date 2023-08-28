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

### Reconciliation

    - Moving from older state to new state by doing some dom-manipulations
    - Virtual Dom consists of objects and not real tags

# POP - point of presence

    - Backend does not send data with the help of CDN.
    - CDN is used only to send static data(HTML, CSS, JS).
    - Frontend sends data with the help of CDN through POPs.
    - CDN also does caching - used to store the data in the memory and recall it when necessary.
    - backend worls on source of truth and data is stored on a server..

# Ways to deploy backend

    - Repl.it
    - GCP, AWS
    - fly.io
    - Firebase functions

Pull Based approach

Push based approach

auto scaling - scale transcoders acc. to needs - pay only for per request(lambda - not used as it is expensive for timed processes)

AWS auto scaling groups

instance -> node.js(getting, transcode,send_back)

we give it a number and it crates instances.. it fails as we decrease the number it frees any of the instance not that which has completed successfully its execution..

final approach ->
Node.js server starts every 5 min. and looks if queue.size > 1 - then create instance with increase in the size of auto scaling groups(ASG)