const input = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("task-list");
const totalElement = document.getElementById("total");
const completeElement = document.getElementById("completed");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Update total and completed stats
function updateStats() {
  totalElement.textContent = tasks.length;
  completeElement.textContent = tasks.filter(t => t.completed).length;
}

// Save tasks to localStorage
function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render task list
function render() {
  list.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task" + (task.completed ? " completed" : "");

    li.innerHTML = `
      <span onclick="toggle(${index})">${task.text}</span>
      <button class="delete-btn" onclick="removeTask(${index})">Delete</button>
    `;

    list.appendChild(li);
  });
  updateStats();
}

// Add a new task
function addTask() {
  const text = input.value.trim();
  if (!text) return;
  tasks.push({ text, completed: false });
  input.value = "";
  save();
  render();
}

// Toggle completed status
function toggle(i) {
  tasks[i].completed = !tasks[i].completed;
  save();
  render();
}

// Remove a task
function removeTask(i) {
  tasks.sp
