function domManipulate(toDoList) {
  const parent = document.getElementById("main-Area");
  parent.innerHTML = "";
  toDoList.forEach(element => {
    // console.log(element);
    const children = document.createElement("div");
    const span1 = document.createElement("span");
    span1.innerHTML = element.title;
    const span2 = document.createElement("span");
    span2.innerHTML = element.description;
    const button = document.createElement("button");
    button.innerHTML = element.id;

    children.appendChild(span1);
    children.appendChild(span2);
    children.appendChild(button);
    parent.appendChild(children);
  });
}

setInterval(() => {
  const toDoList = [];
  for (let i = 0; i < Math.floor(Math.random() * 100); i++) {
    toDoList.push({
      title: "New Item",
      description: "Information about the new item",
      id: i + 1
    });
  }
  domManipulate(toDoList);
}, 3000);
