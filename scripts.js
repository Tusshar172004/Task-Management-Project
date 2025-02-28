document.addEventListener("DOMContentLoaded", checkTasks);

function addTask() {
    let taskName = document.getElementById("taskName").value;
    let taskTime = document.getElementById("taskTime").value;

    if (!taskName || !taskTime) {
        alert("Please enter both task and time.");
        return;
    }

    let task = { name: taskName, time: taskTime };
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    document.getElementById("taskName").value = "";
    document.getElementById("taskTime").value = "";

    displayTasks();
    scheduleNotification(task);
}

function displayTasks() {
    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach((task, index) => {
        let li = document.createElement("li");
        li.innerHTML = `
            ${task.name} - ${new Date(task.time).toLocaleString()}
            <button class="delete-btn" onclick="deleteTask(${index})">X</button>
        `;
        taskList.appendChild(li);
    });
}

function deleteTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks();
}

function scheduleNotification(task) {
    let taskTime = new Date(task.time).getTime();
    let currentTime = new Date().getTime();
    let timeDiff = taskTime - currentTime;

    if (timeDiff > 0) {
        setTimeout(() => {
            new Notification("Task Reminder", { body: `Your task "${task.name}" is due now!` });
        }, timeDiff);
    }
}

function checkTasks() {
    displayTasks();

    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => scheduleNotification(task));
}
