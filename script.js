const input = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("task-list");
const totalElement = document.getElementById("total");
const completeElement = document.getElementById("completed");
const filterButtons = document.querySelectorAll(".filter-btn");
const clearBtn = document.getElementById("clear-completed");
const emptyMessage = document.getElementById("empty-message");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Which tasks are shown: "all", "active" or "completed"
let filter = "all";

// Update total and completed stats
function updateStats() {
  const done = tasks.filter(t => t.completed).length;
  totalElement.textContent = tasks.length;
  completeElement.textContent = done;
  clearBtn.hidden = done === 0;
}

// Save tasks to localStorage
function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// The tasks that match the current filter
function visibleTasks() {
  if (filter === "active") return tasks.filter(t => !t.completed);
  if (filter === "completed") return tasks.filter(t => t.completed);
  return tasks;
}

// Render task list
function render() {
  list.innerHTML = "";
  const visible = visibleTasks();

  visible.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task" + (task.completed ? " completed" : "");

    // textContent keeps task text as plain text, so typed HTML is never run
    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;
    text.addEventListener("click", () => toggle(task));

    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => startEdit(task, li, text));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => removeTask(task));

    li.append(text, editBtn, deleteBtn);
    list.appendChild(li);
  });

  emptyMessage.hidden = visible.length > 0;
  emptyMessage.textContent =
    tasks.length === 0 ? "No tasks yet. Add your first one above." : "No tasks match this filter.";
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
function toggle(task) {
  task.completed = !task.completed;
  save();
  render();
}

// Remove a task
function removeTask(task) {
  tasks = tasks.filter(t => t !== task);
  save();
  render();
}

// Swap the task text for an input so it can be edited in place.
// Enter or clicking away saves, Escape cancels.
function startEdit(task, li, text) {
  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.className = "edit-input";
  editInput.value = task.text;
  editInput.setAttribute("aria-label", "Edit task");
  li.replaceChild(editInput, text);
  editInput.focus();

  let finished = false;

  // Runs once, whichever happens first: Enter, Escape or clicking away
  function finish(saveChange) {
    if (finished) return;
    finished = true;
    const newText = editInput.value.trim();
    // An empty edit keeps the old text instead of saving a blank task
    if (saveChange && newText) {
      task.text = newText;
      save();
    }
    render();
  }

  editInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") finish(true);
    if (e.key === "Escape") finish(false);
  });

  editInput.addEventListener("blur", () => finish(true));
}

// Remove every completed task
function clearCompleted() {
  tasks = tasks.filter(t => !t.completed);
  save();
  render();
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filter = button.dataset.filter;
    filterButtons.forEach((b) => b.classList.toggle("active", b === button));
    filterButtons.forEach((b) => b.setAttribute("aria-pressed", b === button));
    render();
  });
});

addBtn.addEventListener("click", addTask);
clearBtn.addEventListener("click", clearCompleted);

// Pressing Enter in the input adds the task too
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

render();
