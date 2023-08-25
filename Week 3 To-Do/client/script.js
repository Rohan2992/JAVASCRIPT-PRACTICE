window.onload = showList();

async function showList() {
  const Fetch = await fetch("http://localhost:3000/todos", {
    method: "GET"
  });
  const Data = await Fetch.json();

  let li = "";
  for (var i = 0; i < Data.length; i++) {
    li += `<li class="listItem" value= ${Data[i].id}} > ${Data[i]
      .title} - ${Data[i]
      .description}  <button onClick="deleteElementFromList(${Data[i]
      .id})" class="deleteBtn button" type="submit"><span>Delete</span></button> </li>`;
  }

  const ul = document.querySelector(".toDoList");
  ul.innerHTML = li;
}

async function postData() {
  // showList();
  const title = document.getElementById("title");
  const description = document.getElementById("description");

  await fetch("http://localhost:3000/todos", {
    method: "POST",
    body: JSON.stringify({
      title: title.value,
      description: description.value
    }),
    headers: { "Content-Type": "application/json" }
  });
  title.value = "";
  description.value = "";
  showList();
}

async function deleteElementFromList(id) {
  const Fetch = await fetch("http://localhost:3000/todos/" + id, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" }
  });
  await Fetch.json();
  // console.log(data);
  showList();
  // console.log(data);
  // console.log(listElement.textContent.substring(0, 5));
  // console.log("I am clicked");
}
