const taskInput = document.getElementById("task-input");
const prioritySelect = document.getElementById("priority");
const addBtn = document.getElementById("add-btn");
const deleteAllBtn = document.getElementById("delete-all");

const taskColumns = {
  low: document.querySelector("#low-tasks ul"),
  medium: document.querySelector("#medium-tasks ul"),
  high: document.querySelector("#high-tasks ul"),
  done: document.querySelector("#done-tasks ul"),
};

const counts = {
  low: document.getElementById("low-count"),
  medium: document.getElementById("medium-count"),
  high: document.getElementById("high-count"),
  done: document.getElementById("done-count"),
};

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
  Object.keys(taskColumns).forEach((cat) => {
    taskColumns[cat].innerHTML = "";
  });

  tasks.forEach((t, i) => {
    const li = document.createElement("li");
    const taskTop = document.createElement("div");
    taskTop.classList.add("task-actions");

    const textSpan = document.createElement("span");
    textSpan.textContent = t.text;
    taskTop.appendChild(textSpan);

    if (t.category !== "done") {
      const doneBtn = document.createElement("button");
      doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
      doneBtn.onclick = () => markDone(i);
      taskTop.appendChild(doneBtn);
    } else {
      const delBtn = document.createElement("button");
      delBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      delBtn.onclick = () => deleteTask(i);
      taskTop.appendChild(delBtn);
    }

    li.appendChild(taskTop);

    // Tambahkan info kategori asal dan waktu selesai di kolom Done
    if (t.category === "done" && t.doneTime) {
      const doneInfo = document.createElement("p");
      doneInfo.classList.add("done-info");
      doneInfo.innerHTML = `<i class="fa-solid fa-tag"></i> Category: <b>${t.originalCategory}</b>`;
      li.appendChild(doneInfo);

      const doneTime = document.createElement("p");
      doneTime.classList.add("done-time");
      doneTime.innerHTML = `<i class="fa-regular fa-clock"></i> Done at ${t.doneTime}`;
      li.appendChild(doneTime);
    }

    taskColumns[t.category].appendChild(li);
  });

  updateCounts();
}

function updateCounts() {
  ["low", "medium", "high", "done"].forEach((cat) => {
    counts[cat].textContent = tasks.filter((t) => t.category === cat).length;
  });
}

function markDone(index) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour12: false });
  tasks[index].originalCategory = tasks[index].category;
  tasks[index].category = "done";
  tasks[index].doneTime = timeStr;

  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const text = taskInput.value.trim();
  const category = prioritySelect.value;
  if (!text) return alert("Please enter a task!");
  tasks.push({ text, category, doneTime: null, originalCategory: category });
  taskInput.value = "";
  saveTasks();
  renderTasks();
}

// Klik tombol Add
addBtn.addEventListener("click", addTask);

// Tekan Enter untuk menambah task
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

deleteAllBtn.addEventListener("click", () => {
  if (confirm("Delete all tasks?")) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
});

function updateDateTime() {
  const dateElem = document.getElementById("date");
  const clockElem = document.getElementById("clock");
  const now = new Date();
  const options = {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  dateElem.textContent = now.toLocaleDateString("en-ID", options);
  clockElem.textContent = now.toLocaleTimeString();
}
setInterval(updateDateTime, 1000);
updateDateTime();
renderTasks();
// preloader

document.addEventListener("DOMContentLoaded", function () {
  const preloader = document.getElementById("preloader");
  const content = document.querySelector(".content");
  const progress = document.getElementById("progress");
  const loadingText = document.querySelector(".loading-text");

  // Simulate loading progress
  let width = 0;
  const interval = setInterval(() => {
    if (width >= 100) {
      clearInterval(interval);
      loadingText.textContent = "READY";

      setTimeout(() => {
        // Hide preloader with transform
        preloader.classList.add("preloader-done");

        // Show content
        content.style.display = "block";

        // Trigger reflow
        void content.offsetWidth;

        // Fade in content
        content.style.opacity = "1";

        // Remove preloader after animation
        setTimeout(() => {
          preloader.style.display = "none";
        }, 800);
      }, 600);
    } else {
      width += Math.floor(Math.random() * 5) + 1;
      width = Math.min(width, 100);
      progress.style.width = width + "%";

      if (width > 80) {
        loadingText.textContent = "ALMOST THERE";
      } else if (width > 50) {
        loadingText.textContent = "LOADING TASKS";
      }
    }
  }, 100);
});
