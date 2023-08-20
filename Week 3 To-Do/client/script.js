window.onload = showList();

async function showList() {
  const Fetch = await fetch("http://localhost:3000/todos", {
    method: "GET"
  });
  const Data = await Fetch.json();

  let li = "";
  for (var i = 0; i < Data.length; i++) {
    li += `<li>${Data[i].id} - ${Data[i].title} - ${Data[i].description}</li>`;
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
  showList();
}
