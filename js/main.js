let ApiKey = JSON.parse(localStorage.getItem("Api")) || "";
let taskContainer = document.querySelector(".task-list");
let inputData = document.querySelector("#taskInput");
let submitBtn = document.querySelector("#addTask");
let toDoBody = {};
let loader = document.querySelector(".loader");
let toast = document.querySelector(".toast");
let toastBody = document.querySelector(".toast-body");
let addToast = new bootstrap.Toast(toast);
async function getApiKey() {
  if (ApiKey == "") {
    let send = await fetch("https://todos.routemisr.com/api/v1/getApiKey");
    let recievedData = await send.json();
    localStorage.setItem("Api", JSON.stringify(recievedData.apiKey));
    ApiKey = recievedData.apiKey;
  }
}
getApiKey();
console.log(ApiKey);
submitBtn.addEventListener("click", () => {
  toDoBody = {
    title: `${inputData.value}`,
    apiKey: `${ApiKey}`,
  };

  addTask(toDoBody);
});
async function getAllTodos() {
  loader.style.display = "block";
  let send = await fetch(`https://todos.routemisr.com/api/v1/todos/${ApiKey}`);
  let recievedData = await send.json();
  if (recievedData.message == "success" && recievedData.todos.length != 0) {
    displayTasks(recievedData.todos);
    loader.style.display = "none";
    console.log(recievedData.todos);
  } else {
    loader.style.display = "none";
    taskContainer.innerHTML = `<h2 class='lead fw-bold text-center my-5'>No tasks Available</h2>`;
  }
}
async function addTask(dataBody) {
  let send = await fetch("https://todos.routemisr.com/api/v1/todos", {
    method: "post",
    body: JSON.stringify(dataBody),
    headers: {
      "content-type": "application/json",
    },
  });
  let recievedData = await send.json();
  if (recievedData.message == "success") {
    getAllTodos();
    inputData.value = "";
  } else {
    taskContainer.innerHTML = `<h2 class='lead fw-bold text-center my-5'>An Error Occured: A title is required to add a task</h2>`;
  }
  console.log(dataBody);
  console.log(recievedData);
}
async function deleteTask(id) {
  let send = await fetch("https://todos.routemisr.com/api/v1/todos", {
    method: "delete",
    body: id,
    headers: {
      "content-type": "application/json",
    },
  });
  let recievedData = await send.json();
  getAllTodos();
  toastBody.innerText = "Task Has Been Deleted";
  addToast.show();
}
async function completeTask(id) {
  let send = await fetch("https://todos.routemisr.com/api/v1/todos", {
    method: "put",
    body: id,
    headers: {
      "content-type": "application/json",
    },
  });
  let recievedData = await send.json();
  console.log(recievedData);
  if (recievedData.message == "success") {
    toastBody.innerText = "Task Has Been Completed";
    addToast.show();
    getAllTodos();
  }
}
function displayTasks(taskList) {
  let tasks = "";
  allTask = taskList;
  for (let i = 0; i < taskList.length; i++) {
    tasks += `
    <div class="col-12 col-lg-4">
        <div class="task-item  rounded overflow-auto bg-success p-3 my-3 d-flex justify-content-around">
              <p class="mb-0 w-50 ${taskList[i].completed?"text-decoration-line-through":''}">
                ${taskList[i].title}
              </p>
              <div class="d-flex gap-4 align-items-center">
                <i class="fa-regular fa-circle-check complete ${taskList[i].completed?"d-none":''}"></i>
                <i class="fa-regular fa-trash-can delete"></i>
              </div>
            </div>
      </div>
        `;
    
  }
  taskContainer.innerHTML = tasks;
      let taskItems= document.querySelectorAll('.task-item');
      taskItems.forEach(e=>{
        e.style.opacity='0';
        e.style.transition='all .4s'
      })
  setTimeout(() => {
    taskItems.forEach(e=>{
      e.style.opacity='1'
    })
  }, 300);
  let deleteBtn = document.querySelectorAll(".delete");
  let completeBtn = document.querySelectorAll(".complete");
  let id = "";
  deleteBtn.forEach((element, index) => {
    element.addEventListener("click", () => {
      id = taskList[index]._id;
      let body = {
        todoId: id,
      };
      deleteTask(JSON.stringify(body));
    });
  });
  completeBtn.forEach((element, index) => {
    element.addEventListener("click", (e) => {
      console.log(index);
      id = taskList[index]._id;
      let body = {
        todoId: id,
      };
      completeTask(JSON.stringify(body));
    });
  });
}

getAllTodos();
