const a = fetch("http://localhost:3000");
a.then(response => response.json()).then(data => console.log(data));
