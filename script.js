let tasks = [];

const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

document.getElementById("addOneTimeBtn").addEventListener("click", () => addTask("one-time"));
document.getElementById("addMultiBtn").addEventListener("click", () => addTask("multi-step"));
document.getElementById("addEternalBtn").addEventListener("click", () => addTask("eternal"));

function addTask(type) {
  const name = taskInput.value.trim();
  if (!name) return alert("Please enter a task name.");

  let steps = null;
  if (type === "multi-step") {
    const stepCount = prompt("How many steps does this goal have?", "3");
    steps = parseInt(stepCount);
    if (isNaN(steps) || steps <= 0) {
      return alert("Please enter a valid number greater than 0.");
    }
  }

  const task = {
    id: _.uniqueId("task_"),
    name,
    type,
    completed: false,
    steps,
    progress: 0,
    completions: 0, // for eternal goals
  };

  tasks.push(task);
  taskInput.value = "";
  renderTasks();
}

function markTaskDone(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  if (task.type === "multi-step") {
    if (task.progress < task.steps - 1) {
      task.progress++;
    } else {
      task.completed = true;
    }
  } else if (task.type === "eternal") {
    task.completions++;
  } else {
    task.completed = true;
  }

  renderTasks();
}

function undoTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  if (task.type === "multi-step" && task.progress > 0) {
    task.progress--;
    task.completed = false;
  } else if (task.type === "eternal" && task.completions > 0) {
    task.completions--;
  } else {
    task.completed = false;
  }

  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.dataset.id = task.id;

    let progressText = "";
    if (task.type === "multi-step") {
      progressText = `<span class="counter">${task.progress + 1}/${task.steps}</span>`;
    } else if (task.type === "eternal") {
      progressText = `<span class="counter">Completed ${task.completions} times</span>`;
    }

    li.innerHTML = `
      <span>
        ${task.name}
        <span class="task-type">(${task.type})</span>
        ${progressText}
      </span>
      <div>
        <button class="btn-small done-btn">Done</button>
        <button class="btn-small undo-btn">Undo</button>
        <button class="btn-small delete-btn">Delete</button>
      </div>
    `;

    // Eternal goals never get strikethroughs
    if (task.type !== "eternal" && task.completed) {
      li.classList.add("completed");
    } else {
      li.classList.remove("completed");
    }

    const doneBtn = li.querySelector(".done-btn");
    const undoBtn = li.querySelector(".undo-btn");
    const deleteBtn = li.querySelector(".delete-btn");

    doneBtn.addEventListener("click", () => markTaskDone(task.id));
    undoBtn.addEventListener("click", () => undoTask(task.id));
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    taskList.appendChild(li);
  });
}
