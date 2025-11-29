export class StorageManager {
    constructor() {
        this.storageKey = 'dailyPlannerTasks';
    }

    saveTasks(tasks) {
        try {
            const json = JSON.stringify(tasks);
            localStorage.setItem(this.storageKey, json);
        } catch (error) {
            console.error('Error saving tasks to storage:', error);
            // Handle quota exceeded or other storage errors
            if (error.name === 'QuotaExceededError') {
                alert('Storage quota exceeded. Unable to save tasks.');
            }
        }
    }

    loadTasks() {
        try {
            const json = localStorage.getItem(this.storageKey);
            if (!json) {
                return [];
            }
            
            const tasks = JSON.parse(json);
            
            // Validate that it's an array
            if (!Array.isArray(tasks)) {
                console.warn('Invalid task data in storage, initializing empty list');
                return [];
            }
            
            return tasks;
        } catch (error) {
            console.error('Error loading tasks from storage:', error);
            // Handle corrupted data gracefully
            return [];
        }
    }

    clearTasks() {
        try {
            localStorage.removeItem(this.storageKey);
        } catch (error) {
            console.error('Error clearing tasks from storage:', error);
        }
    }
}
