// Advanced To-Do List with task types, recursion, Lodash, and ES6 features

const taskInput = document.getElementById('taskInput');
const addOneTimeBtn = document.getElementById('addOneTimeBtn');
const addMultiBtn = document.getElementById('addMultiBtn');
const addEternalBtn = document.getElementById('addEternalBtn');
const taskList = document.getElementById('taskList');

let tasks = [];

// --- Add Tasks by Type ---
addOneTimeBtn.addEventListener('click', () => addTask('one-time'));
addMultiBtn.addEventListener('click', () => addTask('multi'));
addEternalBtn.addEventListener('click', () => addTask('eternal'));

function addTask(type) {
  const text = taskInput.value.trim();
  if (!text) return alert('Please enter a task name first.');

  let task = {
    id: _.uniqueId('task_'),
    text,
    type,
    completed: false,
    progress: 0,
    required: 1
  };

  if (type === 'multi') {
    const num = parseInt(prompt('How many times should this task be done?'), 10);
    if (!num || num <= 0) return alert('Invalid number.');
    task.required = num;
  }

  tasks.unshift(task);
  taskInput.value = '';
  renderTasks();
}

// --- Toggle / Complete / Undo Task ---
function modifyProgress(id, change) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      if (task.type === 'one-time') {
        // One-time: simple toggle
        return { ...task, completed: !task.completed };
      }

      if (task.type === 'multi') {
        // Multi-step: bounded between 0 and required
        const newProgress = Math.max(0, Math.min(task.required, task.progress + change));
        const completed = newProgress >= task.required;
        return { ...task, progress: newProgress, completed };
      }

      if (task.type === 'eternal') {
        // Eternal: can increase/decrease without bounds (but not below 0)
        const newProgress = Math.max(0, task.progress + change);
        return { ...task, progress: newProgress };
      }
    }
    return task;
  });

  renderTasks();
}

// --- Delete Task ---
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  renderTasks();
}

// --- Recursive Render ---
function renderTasks(index = 0) {
  if (index === 0) taskList.innerHTML = ''; // clear before render
  if (index >= tasks.length) return; // base case

  const task = tasks[index];
  const li = document.createElement('li');
  li.className = task.completed ? 'completed' : '';

  // Task text
  const label = document.createElement('span');
  label.textContent = task.text;

  // Task type label
  const typeTag = document.createElement('span');
  typeTag.className = 'task-type';
  if (task.type === 'one-time') typeTag.textContent = '(One-Time)';
  if (task.type === 'multi') typeTag.textContent = `(x${task.required})`;
  if (task.type === 'eternal') typeTag.textContent = '(Eternal)';
  label.appendChild(typeTag);

  // Progress counter for non-one-time
  if (task.type !== 'one-time') {
    const counter = document.createElement('span');
    counter.className = 'counter';
    counter.textContent = ` | Done: ${task.progress}`;
    label.appendChild(counter);
  }

  const btnContainer = document.createElement('div');

  // Done button
  const doneBtn = document.createElement('button');
  doneBtn.className = 'btn-small';
  doneBtn.textContent = 'Done';
  doneBtn.addEventListener('click', () => modifyProgress(task.id, +1));

  // Undo button (always shown for multi & eternal)
  const undoBtn = document.createElement('button');
  undoBtn.className = 'btn-small';
  undoBtn.textContent = 'Undo';
  undoBtn.addEventListener('click', () => modifyProgress(task.id, -1));

  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn-small';
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', () => deleteTask(task.id));

  // Add appropriate buttons
  if (task.type === 'one-time') {
    doneBtn.textContent = task.completed ? 'Undo' : 'Done';
    btnContainer.appendChild(doneBtn);
  } else {
    btnContainer.appendChild(doneBtn);
    btnContainer.appendChild(undoBtn);
  }

  btnContainer.appendChild(deleteBtn);
  li.appendChild(label);
  li.appendChild(btnContainer);
  taskList.appendChild(li);

  renderTasks(index + 1); // recursion
}

// --- Log incomplete tasks using Lodash ---
function logIncompleteTasks() {
  const incomplete = tasks.filter(t => !t.completed).map(t => t.text);
  console.log('Incomplete tasks:', _.join(incomplete, ', '));
}

const observer = new MutationObserver(logIncompleteTasks);
observer.observe(taskList, { childList: true });
