setInterval(() => {
  const parent = document.getElementById("main-container");
  parent.innerHTML = "";
  for (let i = 0; i < Math.floor(Math.random() * 100); i++) {
    const children = document.createElement("div");
    const grandChildren1 = document.createElement("span");
    const grandChildren2 = document.createElement("span");
    const grandChildren3 = document.createElement("button");

    grandChildren1.textContent = "hello, ";
    grandChildren2.textContent = "world";
    grandChildren3.textContent = "Submit";

    children.appendChild(grandChildren1);
    children.appendChild(grandChildren2);
    children.appendChild(grandChildren3);
    parent.appendChild(children);
  }
}, 1000);
