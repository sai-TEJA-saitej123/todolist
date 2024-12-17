const form = document.getElementById("form");
const userInput = document.getElementById("user-input");
const userDate = document.getElementById("user-date");
const taskPreference = document.getElementById("task-preference");
const taskPriority = document.getElementById("task-priorities");
const taskList = document.getElementById("tasks-list");
const filterButtons = document.querySelectorAll("#filters button");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Add task
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const task = {
    id: Date.now(),
    text: userInput.value,
    completed: false,
    dueDate: userDate.value,
    preference: taskPreference.value,
    priority: taskPriority.value,
  };

  tasks.push(task);
  updateLocalStorage();
  renderTasks();
  form.reset();
});

// Render tasks
function renderTasks(filterTasks = tasks) {
  taskList.innerHTML = "";
  filterTasks.forEach((task) => {
    const list = document.createElement("li");
    list.setAttribute("data-id", task.id);
    list.classList.toggle("completed", task.completed);

    list.innerHTML = `
      <div class="card">
  <div>
    <input type="checkbox" ${task.completed ? "checked" : ""}>
    <p>${task.text}</p>
  </div>
  <div>
    <p>Due: ${task.dueDate || "No date"}</p>
    <p>Priority: ${task.preference}</p>
  </div>
  </div>
  <div>
    <button class="edit-btn">EDIT</button>
  <button class="delete-btn">DELETE</button></div>
  
`;

    taskList.appendChild(list);
  });
}

// Update local storage
function updateLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Toggle task completion
taskList.addEventListener("change", (e) => {
  if (e.target.type === "checkbox") {
    const taskId = parseInt(
      e.target.closest("li").getAttribute("data-id")
    );
    const task = tasks.find((t) => t.id === taskId);
    task.completed = e.target.checked;
    updateLocalStorage();
    renderTasks();
  }
});

// Delete task
taskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const taskId = parseInt(
      e.target.closest("li").getAttribute("data-id")
    );
    tasks = tasks.filter((t) => t.id !== taskId);
    updateLocalStorage();
    renderTasks();
  }
});

// Edit task
taskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit-btn")) {
    const taskId = parseInt(
      e.target.closest("li").getAttribute("data-id")
    );
    const task = tasks.find((t) => t.id === taskId);
    const newText = prompt("Edit task:", task.text);
    if (newText !== null) {
      task.text = newText;
      updateLocalStorage();
      renderTasks();
    }
  }
});

// Filter tasks
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const filter = button.id;
    let filteredTasks = [];

    switch (filter) {
      case "active":
        filteredTasks = tasks.filter((task) => !task.completed);
        break;
      case "completed":
        filteredTasks = tasks.filter((task) => task.completed);
        break;
      default:
        filteredTasks = tasks;
    }

    renderTasks(filteredTasks);
  });
});

// Initial render
renderTasks();