class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.form = document.getElementById('task-form');
        this.tasksContainer = document.getElementById('tasks-container');
        this.taskNumber = document.querySelector('.task-number');
        this.updateTaskNumber(); // Add this line to initialize task number
        this.setupEventListeners();
        this.renderTasks();
    }

    loadTasks() {
        const tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : {
            mainTask: { text: null, completed: false },
            secondaryTasks: []
        };
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        this.updateTaskNumber();
    }

    addTask(text, isMain) {
        if (isMain) {
            this.tasks.mainTask = { text, completed: false };
        } else {
            this.tasks.secondaryTasks.push({ text, completed: false });
        }
        this.saveTasks();
        this.renderTasks();
    }

    toggleTaskCompletion(isMain, index) {
        if (isMain) {
            this.tasks.mainTask.completed = !this.tasks.mainTask.completed;
        } else {
            this.tasks.secondaryTasks[index].completed = !this.tasks.secondaryTasks[index].completed;
        }
        this.saveTasks();
        this.renderTasks();
    }

    renderTasks() {
        this.tasksContainer.innerHTML = '';
        
        if (this.tasks.mainTask.text) {
            const mainTaskDiv = document.createElement('div');
            mainTaskDiv.className = `main-task${this.tasks.mainTask.completed ? ' completed' : ''}`;
            mainTaskDiv.textContent = this.tasks.mainTask.text;
            mainTaskDiv.addEventListener('click', () => this.toggleTaskCompletion(true, 0));
            this.tasksContainer.appendChild(mainTaskDiv);
        }

        this.tasks.secondaryTasks.forEach((task, index) => {
            const taskDiv = document.createElement('div');
            taskDiv.className = `secondary-task${task.completed ? ' completed' : ''}`;
            taskDiv.textContent = task.text;
            taskDiv.addEventListener('click', () => this.toggleTaskCompletion(false, index));
            this.tasksContainer.appendChild(taskDiv);
        });
    }

    updateTaskNumber() {
        const uncompleteMainTask = this.tasks.mainTask.text && !this.tasks.mainTask.completed ? 1 : 0;
        const uncompleteSecondaryTasks = this.tasks.secondaryTasks.filter(task => !task.completed).length;
        const totalUncompleteTasks = uncompleteMainTask + uncompleteSecondaryTasks;
        this.taskNumber.textContent = totalUncompleteTasks || '0';
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('task-input');
            const isMain = document.getElementById('is-main-task').checked;
            
            if (input.value.trim()) {
                this.addTask(input.value.trim(), isMain);
                input.value = '';
            }
        });
    }
}

// Initialize TaskManager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TaskManager();
});
