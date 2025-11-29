export class TaskManager {
    constructor() {
        this.tasks = [];
    }

    addTask(description, time = null, completed = false, id = null) {
        const task = {
            id: id || this.generateId(),
            description,
            time,
            completed,
            createdAt: Date.now()
        };
        
        this.tasks.push(task);
        this.sortTasks();
        return task;
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
    }

    updateTask(taskId, description, time) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.description = description;
            task.time = time;
            this.sortTasks();
        }
    }

    toggleComplete(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
        }
    }

    getTasks() {
        return [...this.tasks];
    }

    sortTasks() {
        this.tasks.sort((a, b) => {
            // Tasks with time come before tasks without time
            if (a.time && !b.time) return -1;
            if (!a.time && b.time) return 1;
            
            // Both have time: sort chronologically
            if (a.time && b.time) {
                return a.time.localeCompare(b.time);
            }
            
            // Neither has time: sort by creation time
            return a.createdAt - b.createdAt;
        });
    }

    generateId() {
        return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}
