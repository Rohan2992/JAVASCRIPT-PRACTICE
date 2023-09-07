let vDOM = [];

function domManipulate(existingDOM) {
  let added = 0;
  let updated = 0;
  let deleted = 0;

  const parent = document.getElementById("main-Area");

  //   console.log(arr);

  vDOM.forEach(item => {
    const elementExists = existingDOM.find(ec => {
      return ec.id === item.id;
    });
    // console.log(elementExists);

    if (elementExists) {
      updated++;
      var existingElement = document.querySelector(`[data-id="${item.id}"]`);
      existingElement.children[0].innerHTML = item.title;
      existingElement.children[1].innerHTML = item.description;
    } else {
      added++;
      // console.log(element);
      const children = document.createElement("div");
      children.dataset.id = item.id;
      const span1 = document.createElement("span");
      span1.innerHTML = item.title;
      const span2 = document.createElement("span");
      span2.innerHTML = item.description;
      const button = document.createElement("button");
      button.innerHTML = item.id;

      children.appendChild(span1);
      children.appendChild(span2);
      children.appendChild(button);
      parent.appendChild(children);
    }
  });
  //   console.log(existingChildren);

  existingDOM.forEach(item => {
    if (!vDOM.some(a => a.id === item.id)) {
      deleted++;
      var childToRemove = document.querySelector(`[data-id="${item.id}"]`);
      parent.removeChild(childToRemove);
    }
  });
  console.log(added, updated, deleted);
}

function updateVirtualDOM(toDoList) {
  let existingDOM = [...vDOM];

  vDOM = toDoList.map(e => {
    return {
      title: e.title,
      description: e.description,
      id: e.id
    };
  });

  domManipulate(existingDOM);
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
  updateVirtualDOM(toDoList);
}, 1000);

const button = document.getElementById("button");
button.addEventListener("click", () => {
  clearInterval(interval);
});
