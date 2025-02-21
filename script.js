document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");
    const sortAlphabeticallyBtn = document.getElementById("sortAlphabetically");
    const sortByTimeBtn = document.getElementById("sortByTime");
    const sortByLengthBtn = document.getElementById("sortByLength");
    const clearTasksBtn = document.getElementById("clearTasks");

    loadTasks();

    addTaskBtn.addEventListener("click", addTask);
    taskInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") addTask();
    });

    sortAlphabeticallyBtn.addEventListener("click", sortAlphabetically);
    sortByTimeBtn.addEventListener("click", sortByTime);
    sortByLengthBtn.addEventListener("click", sortByLength);
    clearTasksBtn.addEventListener("click", clearAllTasks);

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === "") return;

        const taskData = {
            text: taskText,
            completed: false,
            timestamp: Date.now(),
        };

        const li = createTaskElement(taskData);
        taskList.appendChild(li);
        taskInput.value = "";

        saveTasks();
    }

    function createTaskElement(taskData) {
        const li = document.createElement("li");
        const span = document.createElement("span");
        span.textContent = taskData.text;
        
        li.dataset.timestamp = taskData.timestamp;

        if (taskData.completed) li.classList.add("completed");

        span.addEventListener("click", function () {
            li.classList.toggle("completed");
            saveTasks();
        });

        const editBtn = document.createElement("button");
        editBtn.textContent = "✏️";
        editBtn.classList.add("edit-btn");
        editBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            editTask(span);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            li.remove();
            saveTasks();
        });

        li.appendChild(span);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        return li;
    }

    function editTask(taskSpan) {
        const newTaskText = prompt("Edit your task:", taskSpan.textContent);
        if (newTaskText !== null && newTaskText.trim() !== "") {
            taskSpan.textContent = newTaskText.trim();
            saveTasks();
        }
    }

    function saveTasks() {
        const tasks = [];
        document.querySelectorAll("#taskList li").forEach(li => {
            tasks.push({
                text: li.querySelector("span").textContent,
                completed: li.classList.contains("completed"),
                timestamp: parseInt(li.dataset.timestamp),
            });
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => {
            const li = createTaskElement(task);
            taskList.appendChild(li);
        });
    }

    function sortAlphabetically() {
        let tasksArray = Array.from(document.querySelectorAll("#taskList li"));
        tasksArray.sort((a, b) => a.textContent.localeCompare(b.textContent));

        taskList.innerHTML = "";
        tasksArray.forEach(task => taskList.appendChild(task));
        saveTasks();
    }

    function sortByTime() {
        let tasksArray = Array.from(document.querySelectorAll("#taskList li"));
        tasksArray.sort((a, b) => parseInt(a.dataset.timestamp) - parseInt(b.dataset.timestamp));

        taskList.innerHTML = "";
        tasksArray.forEach(task => taskList.appendChild(task));
        saveTasks();
    }

    function sortByLength() {
        let tasksArray = Array.from(document.querySelectorAll("#taskList li"));
        tasksArray.sort((a, b) => a.textContent.length - b.textContent.length);

        taskList.innerHTML = "";
        tasksArray.forEach(task => taskList.appendChild(task));
        saveTasks();
    }

    function clearAllTasks() {
        if (confirm("Are you sure you want to delete all tasks?")) {
            taskList.innerHTML = "";
            localStorage.removeItem("tasks");
        }
    }
});
