function domManipulate(toDoList) {
  let added = 0;
  let updated = 0;
  let deleted = 0;

  const parent = document.getElementById("main-Area");

  let existingChildren = Array.from(parent.children);
  //   console.log(arr);

  toDoList.forEach(toDo => {
    const elementExists = existingChildren.find(ec => {
      return ec.dataset.id === String(toDo.id);
    });
    // console.log(elementExists);

    if (elementExists) {
      updated++;
      elementExists.children[0].innerHTML = toDo.title;
      elementExists.children[1].innerHTML = toDo.description;

      existingChildren = existingChildren.filter(ec => {
        return ec !== elementExists;
      });
    } else {
      added++;
      // console.log(element);
      const children = document.createElement("div");
      children.dataset.id = toDo.id;
      const span1 = document.createElement("span");
      span1.innerHTML = toDo.title;
      const span2 = document.createElement("span");
      span2.innerHTML = toDo.description;
      const button = document.createElement("button");
      button.innerHTML = toDo.id;

      children.appendChild(span1);
      children.appendChild(span2);
      children.appendChild(button);
      parent.appendChild(children);
    }
  });
  //   console.log(existingChildren);
  existingChildren.forEach(ec => {
    deleted++;
    parent.removeChild(ec);
  });
  console.log(added, updated, deleted);
}

const interval = setInterval(() => {
  const toDoList = [];
  for (let i = 0; i < Math.floor(Math.random() * 100); i++) {
    toDoList.push({
      title: "New Item",
      description: "Information about the new item",
      id: i + 1
    });
  }
  domManipulate(toDoList);
}, 1000);

const button = document.getElementById("button");
button.addEventListener("click", () => {
  clearInterval(interval);
});
