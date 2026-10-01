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

    // textContent keeps task text as plain text, so typed HTML is never run
    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;
    text.addEventListener("click", () => toggle(index));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => removeTask(index));

    li.append(text, deleteBtn);
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
  tasks.splice(i, 1);
  save();
  render();
}

addBtn.addEventListener("click", addTask);

// Pressing Enter in the input adds the task too
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

render();
