class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.form = document.getElementById('task-form');
        this.tasksContainer = document.getElementById('tasks-container');
        this.taskNumber = document.querySelector('.task-number');
        this.toggleButton = document.getElementById('toggle-form');
        this.updateTaskNumber();
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

    deleteTask(isMain, index) {
        const taskElement = isMain ? 
            this.tasksContainer.querySelector('.main-task') :
            this.tasksContainer.querySelectorAll('.secondary-task')[index];
        
        taskElement.classList.add('removing');
        
        // Wait for animation to complete before removing
        setTimeout(() => {
            if (isMain) {
                this.tasks.mainTask = { text: null, completed: false };
            } else {
                this.tasks.secondaryTasks.splice(index, 1);
            }
            this.saveTasks();
            this.renderTasks();
        }, 300); // Match animation duration
    }

    renderTasks() {
        this.tasksContainer.innerHTML = '';
        
        if (this.tasks.mainTask.text) {
            const mainTaskDiv = document.createElement('div');
            mainTaskDiv.className = `main-task${this.tasks.mainTask.completed ? ' completed' : ''}`;
            mainTaskDiv.textContent = this.tasks.mainTask.text;
            
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-button';
            deleteButton.textContent = 'X';
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteTask(true, 0);
            });
            
            mainTaskDiv.appendChild(deleteButton);
            mainTaskDiv.addEventListener('click', () => this.toggleTaskCompletion(true, 0));
            this.tasksContainer.appendChild(mainTaskDiv);
            // Force reflow to trigger animation
            mainTaskDiv.offsetHeight;
        }

        this.tasks.secondaryTasks.forEach((task, index) => {
            const taskDiv = document.createElement('div');
            taskDiv.className = `secondary-task${task.completed ? ' completed' : ''}`;
            taskDiv.textContent = task.text;
            
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-button';
            deleteButton.textContent = 'X';
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteTask(false, index);
            });
            
            taskDiv.appendChild(deleteButton);
            taskDiv.addEventListener('click', () => this.toggleTaskCompletion(false, index));
            this.tasksContainer.appendChild(taskDiv);
            // Force reflow to trigger animation
            taskDiv.offsetHeight;
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
            const isMainCheckbox = document.getElementById('is-main-task');
            
            if (input.value.trim()) {
                this.addTask(input.value.trim(), isMainCheckbox.checked);
                input.value = '';
                isMainCheckbox.checked = false;
            }
        });

        this.toggleButton.addEventListener('click', () => {
            this.form.classList.toggle('hidden');
            this.toggleButton.textContent = this.form.classList.contains('hidden') 
                ? '+ New' 
                : 'Close';
        });
    }
}

// Initialize TaskManager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TaskManager();
});
