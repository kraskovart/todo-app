const API = "http://localhost:5000";

async function loadTasks() {
    const res = await fetch(`${API}/tasks`);
    const tasks = await res.json();
    const list = document.getElementById("taskList");

    if (tasks.length === 0) {
        list.innerHTML = '<li class="empty">Задач пока нет 🎉</li>';
        return;
    }

    list.innerHTML = tasks.map(task => `
        <li class="task-item">
            <input 
                type="checkbox" 
                ${task.done ? "checked" : ""}
                onchange="toggleTask(${task.id}, this.checked)"
            />
            <span class="task-title ${task.done ? "done" : ""}">${task.title}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">✕</button>
        </li>
    `).join("");
}

async function addTask() {
    const input = document.getElementById("taskInput");
    const title = input.value.trim();
    if (!title) return;

    await fetch(`${API}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
    });

    input.value = "";
    loadTasks();
}

async function toggleTask(id, done) {
    await fetch(`${API}/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done })
    });
    loadTasks();
}

async function deleteTask(id) {
    await fetch(`${API}/tasks/${id}`, { method: "DELETE" });
    loadTasks();
}

document.getElementById("taskInput").addEventListener("keypress", e => {
    if (e.key === "Enter") addTask();
});

loadTasks();
