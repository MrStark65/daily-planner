import { TaskManager } from './js/taskManager.js';
import { StorageManager } from './js/storageManager.js';
import { UIManager } from './js/uiManager.js';
import { DateManager } from './js/dateManager.js';

class DailyPlanner {
    constructor() {
        this.taskManager = new TaskManager();
        this.storageManager = new StorageManager();
        this.uiManager = new UIManager();
        this.dateManager = new DateManager();
        
        this.init();
    }

    init() {
        // Load tasks from storage
        const savedTasks = this.storageManager.loadTasks();
        savedTasks.forEach(task => this.taskManager.addTask(task.description, task.time, task.completed, task.id));
        
        // Update date display
        this.dateManager.updateDate();
        
        // Render initial tasks
        this.render();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Check for date changes at midnight
        this.dateManager.startMidnightCheck(() => {
            this.dateManager.updateDate();
        });
    }

    setupEventListeners() {
        const form = document.getElementById('task-form');
        form.addEventListener('submit', (e) => this.handleAddTask(e));
    }

    handleAddTask(e) {
        e.preventDefault();
        
        const descriptionInput = document.getElementById('task-description');
        const timeInput = document.getElementById('task-time');
        const description = descriptionInput.value;
        const time = timeInput.value || null;
        
        // Validate description
        if (!description.trim()) {
            this.uiManager.showValidationMessage('Please enter a task description');
            return;
        }
        
        // Add task
        this.taskManager.addTask(description.trim(), time);
        
        // Save to storage
        this.storageManager.saveTasks(this.taskManager.getTasks());
        
        // Clear form
        descriptionInput.value = '';
        timeInput.value = '';
        descriptionInput.focus();
        this.uiManager.clearValidationMessage();
        
        // Re-render
        this.render();
    }

    handleToggleComplete(taskId) {
        this.taskManager.toggleComplete(taskId);
        this.storageManager.saveTasks(this.taskManager.getTasks());
        this.render();
    }

    handleDeleteTask(taskId) {
        this.taskManager.deleteTask(taskId);
        this.storageManager.saveTasks(this.taskManager.getTasks());
        this.render();
    }

    handleEditTask(taskId, newDescription, newTime) {
        if (!newDescription.trim()) {
            this.uiManager.showValidationMessage('Task description cannot be empty');
            return false;
        }
        
        this.taskManager.updateTask(taskId, newDescription.trim(), newTime);
        this.storageManager.saveTasks(this.taskManager.getTasks());
        this.uiManager.clearValidationMessage();
        this.render();
        return true;
    }

    render() {
        const tasks = this.taskManager.getTasks();
        this.uiManager.renderTasks(tasks, {
            onToggle: (id) => this.handleToggleComplete(id),
            onDelete: (id) => this.handleDeleteTask(id),
            onEdit: (id, desc, time) => this.handleEditTask(id, desc, time)
        });
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new DailyPlanner();
});
