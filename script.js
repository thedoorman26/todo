let tasks = []; // Stores all task objects

const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

// Event listeners for adding different task types
document.getElementById("addOneTimeBtn").addEventListener("click", () => safeCall(() => addTask("one-time")));
document.getElementById("addMultiBtn").addEventListener("click", () => safeCall(() => addTask("multi-step")));
document.getElementById("addEternalBtn").addEventListener("click", () => safeCall(() => addTask("eternal")));

/**
 * A simple wrapper to safely execute any function
 * and show user-friendly error alerts.
 */
function safeCall(fn) {
  try {
    fn(); // Run the provided function
  } catch (err) {
    console.error("Error:", err);
    alert(`${err.message}`); // Show readable error
  }
}

function addTask(type) {
  const name = taskInput.value.trim();
  if (!name) throw new Error("Please enter a task name.");

  let steps = null;

  if (type === "multi-step") {
    const stepCount = prompt("How many steps does this goal have?", "3"); // Ask for step count
    if (stepCount === null) throw new Error("Task creation canceled.");
    steps = parseInt(stepCount);
    if (isNaN(steps) || steps <= 0) {
      throw new Error("Please enter a valid number greater than 0 for steps.");
    }
  }

  const validTypes = ["one-time", "multi-step", "eternal"];
  if (!validTypes.includes(type)) {
    throw new Error(`Invalid task type: ${type}`);
  }

  const task = {
    id: _.uniqueId("task_"), // Lodash: generate unique task ID
    name,
    type,
    completed: false,
    steps,
    progress: 0,
    completions: 0,
  };

  tasks.push(task); // Add to main list
  taskInput.value = ""; // Clear input box
  renderTasks(); // Update the displayed list
}

function markTaskDone(id) {
  const task = tasks.find(t => t.id === id); // Find task by ID
  if (!task) throw new Error(`Task with ID ${id} not found.`);

  switch (task.type) {
    case "multi-step":
      if (task.progress < task.steps - 1) {
        task.progress++; // Move to next step
      } else {
        task.completed = true; // All steps done
        task.progress = task.steps;
      }
      break;
    case "eternal":
      task.completions++; // Count another completion
      break;
    case "one-time":
      task.completed = true; // Mark as done
      break;
    default:
      throw new Error(`Unknown task type: ${task.type}`);
  }

  renderTasks(); // Re-render after change
}

function undoTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) throw new Error(`Task with ID ${id} not found.`);

  switch (task.type) {
    case "multi-step":
      if (task.progress > 0) {
        task.progress--; // Go back a step
        task.completed = false;
      }
      break;
    case "eternal":
      if (task.completions > 0) {
        task.completions--; // Undo one completion
      }
      break;
    case "one-time":
      task.completed = false; // Unmark as complete
      break;
    default:
      throw new Error(`Unknown task type: ${task.type}`);
  }

  renderTasks();
}

function deleteTask(id) {
  const initialCount = tasks.length;
  tasks = tasks.filter(t => t.id !== id); // Remove task by ID

  if (tasks.length === initialCount) {
    throw new Error(`Cannot delete: Task with ID ${id} not found.`);
  }

  renderTasks();
}

function renderTasks() {
  try {
    taskList.innerHTML = "";

    // Recursive helper to render tasks one by one
    function renderRecursive(index) {
      // Base case: stop when index reaches the end
      if (index >= tasks.length) return;

      const task = tasks[index];
      const li = document.createElement("li");
      li.dataset.id = task.id;

      let progressText = "";
      if (task.type === "multi-step") {
        progressText = `<span class="counter">${task.progress}/${task.steps}</span>`;
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

      if (task.type !== "eternal" && task.completed) {
        li.classList.add("completed");
      }

      li.querySelector(".done-btn").addEventListener("click", () =>
        safeCall(() => markTaskDone(task.id))
      );
      li.querySelector(".undo-btn").addEventListener("click", () =>
        safeCall(() => undoTask(task.id))
      );
      li.querySelector(".delete-btn").addEventListener("click", () =>
        safeCall(() => deleteTask(task.id))
      );

      taskList.appendChild(li);

      // Recursive call: render next task
      renderRecursive(index + 1);
    }

    // Start recursion from the first task
    renderRecursive(0);

  } catch (err) {
    console.error("Rendering error:", err);
    alert(`Rendering failed: ${err.message}`);
  }
}