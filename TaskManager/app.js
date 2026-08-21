const starterTasks = [
    { id: 1, title: "Outline the new portfolio case study", list: "work", priority: "high", due: "2026-08-22", completed: false, created: 1 },
    { id: 2, title: "Book a dentist appointment", list: "personal", priority: "medium", due: "2026-08-23", completed: false, created: 2 },
    { id: 3, title: "Finish JavaScript practice lesson", list: "learning", priority: "low", due: "2026-08-25", completed: false, created: 3 },
    { id: 4, title: "Send the project follow-up email", list: "work", priority: "medium", due: "2026-08-21", completed: true, created: 4 }
];

let profile = JSON.parse(localStorage.getItem("daymarkProfile")) || null;
let tasks = JSON.parse(localStorage.getItem("daymarkTasks")) || [];
let activeView = "all";
let activeStatus = "all";

const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const taskModal = document.getElementById("taskModal");
const taskForm = document.getElementById("taskForm");
const setupModal = document.getElementById("setupModal");
const setupForm = document.getElementById("setupForm");
const today = new Date();
const todayString = today.toISOString().split("T")[0];

function saveTasks() {
    localStorage.setItem("daymarkTasks", JSON.stringify(tasks));
}

function saveProfile() {
    localStorage.setItem("daymarkProfile", JSON.stringify(profile));
}

function getInitials(name) {
    return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join("");
}

function applyProfile() {
    const displayName = profile ? profile.name : "there";
    const workspaceName = profile ? profile.workspace : "Personal workspace";
    const initials = profile ? getInitials(profile.name) : "--";
    document.getElementById("welcomeName").textContent = displayName.split(" ")[0];
    document.getElementById("profileName").textContent = displayName;
    document.getElementById("profileWorkspace").textContent = workspaceName;
    document.getElementById("workspaceLabel").textContent = workspaceName;
    document.getElementById("profileInitials").textContent = initials;
    document.getElementById("topInitials").textContent = initials;
}

function formatDate(dateValue) {
    if (!dateValue) return "No due date";
    const date = new Date(dateValue + "T00:00:00");
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function escapeHTML(value) {
    return String(value).replace(/[&<>'"]/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#039;",
        "\"": "&quot;"
    }[character]));
}

function getVisibleTasks() {
    const searchText = document.getElementById("searchInput").value.toLowerCase();
    const sortValue = document.getElementById("sortSelect").value;
    let visibleTasks = tasks.filter((task) => {
        const matchesView = activeView === "all" || (activeView === "today" && task.due === todayString) || (activeView === "upcoming" && task.due > todayString) || task.list === activeView;
        const matchesStatus = activeStatus === "all" || (activeStatus === "completed" && task.completed) || (activeStatus === "active" && !task.completed);
        const matchesSearch = task.title.toLowerCase().includes(searchText);
        return matchesView && matchesStatus && matchesSearch;
    });

    visibleTasks.sort((firstTask, secondTask) => {
        if (sortValue === "due") return (firstTask.due || "9999") .localeCompare(secondTask.due || "9999");
        if (sortValue === "priority") return { high: 1, medium: 2, low: 3 }[firstTask.priority] - { high: 1, medium: 2, low: 3 }[secondTask.priority];
        return secondTask.created - firstTask.created;
    });
    return visibleTasks;
}

function renderTasks() {
    const visibleTasks = getVisibleTasks();
    taskList.innerHTML = "";
    emptyState.classList.toggle("hidden", visibleTasks.length > 0);

    visibleTasks.forEach((task) => {
        const row = document.createElement("article");
        row.className = "task-row" + (task.completed ? " is-complete" : "");
        const safeTitle = escapeHTML(task.title);
        const safeList = escapeHTML(task.list.charAt(0).toUpperCase() + task.list.slice(1));
        row.innerHTML = `<input class="task-check" type="checkbox" ${task.completed ? "checked" : ""} aria-label="Mark ${safeTitle} complete"><div class="task-main"><strong>${safeTitle}</strong><small>${safeList}</small></div><span class="priority priority-${task.priority}">${task.priority}</span><span class="task-due ${task.due && task.due < todayString && !task.completed ? "overdue" : ""}">${formatDate(task.due)}</span><button class="delete-task" type="button" aria-label="Delete ${safeTitle}">&times;</button>`;
        row.querySelector(".task-check").addEventListener("change", () => toggleTask(task.id));
        row.querySelector(".delete-task").addEventListener("click", () => deleteTask(task.id));
        taskList.appendChild(row);
    });
}

function updateSummary() {
    const completedTasks = tasks.filter((task) => task.completed).length;
    const openTasks = tasks.length - completedTasks;
    const percentage = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;
    document.getElementById("progressPercent").textContent = percentage + "%";
    document.getElementById("progressBar").style.width = percentage + "%";
    document.getElementById("progressText").textContent = `${completedTasks} of ${tasks.length} tasks complete`;
    document.getElementById("openCount").textContent = openTasks;
    document.getElementById("completedCount").textContent = completedTasks;
    document.getElementById("allCount").textContent = tasks.length;
    document.getElementById("todayCount").textContent = tasks.filter((task) => task.due === todayString).length;
    document.getElementById("upcomingCount").textContent = tasks.filter((task) => task.due > todayString).length;
    document.getElementById("tabAllCount").textContent = tasks.length;
    document.getElementById("tabActiveCount").textContent = openTasks;
    document.getElementById("tabCompletedCount").textContent = completedTasks;
}

function toggleTask(taskId) {
    tasks = tasks.map((task) => task.id === taskId ? { ...task, completed: !task.completed } : task);
    saveTasks();
    updateSummary();
    renderTasks();
}

function deleteTask(taskId) {
    tasks = tasks.filter((task) => task.id !== taskId);
    saveTasks();
    updateSummary();
    renderTasks();
}

function openModal() {
    taskModal.classList.remove("hidden");
    document.getElementById("taskTitle").focus();
}

function closeModal() {
    taskModal.classList.add("hidden");
    taskForm.reset();
}

function openSetup() {
    document.getElementById("setupName").value = profile ? profile.name : "";
    document.getElementById("setupWorkspace").value = profile ? profile.workspace : "";
    setupModal.classList.remove("hidden");
    document.getElementById("setupName").focus();
}

document.getElementById("openTaskModal").addEventListener("click", openModal);
document.getElementById("emptyAddTask").addEventListener("click", openModal);
document.getElementById("closeTaskModal").addEventListener("click", closeModal);
document.getElementById("cancelTask").addEventListener("click", closeModal);
taskModal.addEventListener("click", (event) => { if (event.target === taskModal) closeModal(); });

document.getElementById("profileButton").addEventListener("click", openSetup);
document.getElementById("topInitials").addEventListener("click", openSetup);
document.getElementById("closeSetup").addEventListener("click", () => {
    if (profile) setupModal.classList.add("hidden");
});

setupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(setupForm);
    profile = { name: formData.get("name").trim(), workspace: formData.get("workspace").trim() };
    tasks = document.getElementById("loadDemoTasks").checked ? starterTasks : [];
    saveProfile();
    saveTasks();
    applyProfile();
    updateSummary();
    renderTasks();
    setupModal.classList.add("hidden");
});

taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(taskForm);
    tasks.unshift({ id: Date.now(), title: formData.get("title"), list: formData.get("list"), priority: formData.get("priority"), due: formData.get("due"), completed: false, created: Date.now() });
    saveTasks();
    updateSummary();
    renderTasks();
    closeModal();
});

document.querySelectorAll(".side-link").forEach((link) => {
    link.addEventListener("click", () => {
        document.querySelectorAll(".side-link").forEach((item) => item.classList.remove("active"));
        link.classList.add("active");
        activeView = link.dataset.view;
        const label = link.textContent.trim().replace(/\d+$/, "").trim();
        document.getElementById("viewName").textContent = label;
        document.getElementById("taskHeading").textContent = label;
        document.getElementById("taskSubheading").textContent = activeView === "all" ? "Everything you are working on in one place." : `Tasks saved in your ${label.toLowerCase()} view.`;
        renderTasks();
        document.getElementById("sidebar").classList.remove("open");
    });
});

document.querySelectorAll(".filter-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
        document.querySelectorAll(".filter-tab").forEach((item) => item.classList.remove("active"));
        tab.classList.add("active");
        activeStatus = tab.dataset.status;
        renderTasks();
    });
});

document.getElementById("searchInput").addEventListener("input", renderTasks);
document.getElementById("sortSelect").addEventListener("change", renderTasks);
document.getElementById("mobileMenu").addEventListener("click", () => {
    const sidebar = document.getElementById("sidebar");
    const isOpen = sidebar.classList.toggle("open");
    document.getElementById("mobileMenu").setAttribute("aria-expanded", isOpen);
});

document.getElementById("currentDate").textContent = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
applyProfile();
updateSummary();
renderTasks();

if (!profile) {
    openSetup();
}
