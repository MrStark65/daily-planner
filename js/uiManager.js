export class UIManager {
    constructor() {
        this.taskListElement = document.getElementById('task-list');
        this.emptyStateElement = document.getElementById('empty-state');
        this.validationMessageElement = document.getElementById('validation-message');
    }

    renderTasks(tasks, callbacks) {
        // Clear current list
        this.taskListElement.innerHTML = '';
        
        // Show/hide empty state
        if (tasks.length === 0) {
            this.showEmptyState();
        } else {
            this.hideEmptyState();
            tasks.forEach(task => {
                const taskElement = this.renderTask(task, callbacks);
                this.taskListElement.appendChild(taskElement);
            });
        }
    }

    renderTask(task, callbacks) {
        const li = document.createElement('li');
        li.className = `task-item${task.completed ? ' completed' : ''}`;
        li.dataset.taskId = task.id;
        
        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.setAttribute('aria-label', 'Mark task as complete');
        checkbox.addEventListener('change', () => callbacks.onToggle(task.id));
        
        // Task content
        const content = document.createElement('div');
        content.className = 'task-content';
        
        if (task.time) {
            const timeSpan = document.createElement('span');
            timeSpan.className = 'task-time';
            timeSpan.textContent = this.formatTime(task.time);
            content.appendChild(timeSpan);
        }
        
        const descSpan = document.createElement('span');
        descSpan.className = 'task-description';
        descSpan.textContent = task.description;
        content.appendChild(descSpan);
        
        // Actions
        const actions = document.createElement('div');
        actions.className = 'task-actions';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'btn-icon btn-edit';
        editBtn.textContent = 'Edit';
        editBtn.setAttribute('aria-label', 'Edit task');
        editBtn.addEventListener('click', () => this.enterEditMode(li, task, callbacks));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-icon btn-delete';
        deleteBtn.textContent = 'Delete';
        deleteBtn.setAttribute('aria-label', 'Delete task');
        deleteBtn.addEventListener('click', () => callbacks.onDelete(task.id));
        
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        
        li.appendChild(checkbox);
        li.appendChild(content);
        li.appendChild(actions);
        
        return li;
    }

    enterEditMode(taskElement, task, callbacks) {
        const content = taskElement.querySelector('.task-content');
        const actions = taskElement.querySelector('.task-actions');
        
        // Store original values for cancel
        const originalDescription = task.description;
        const originalTime = task.time;
        
        // Clear content
        content.innerHTML = '';
        content.className = 'task-content editing';
        
        // Create edit inputs
        const timeInput = document.createElement('input');
        timeInput.type = 'time';
        timeInput.className = 'task-edit-time';
        timeInput.value = task.time || '';
        
        const descInput = document.createElement('input');
        descInput.type = 'text';
        descInput.className = 'task-edit-input';
        descInput.value = task.description;
        
        content.appendChild(timeInput);
        content.appendChild(descInput);
        
        // Update actions
        actions.innerHTML = '';
        
        const saveBtn = document.createElement('button');
        saveBtn.className = 'btn-icon btn-save';
        saveBtn.textContent = 'Save';
        saveBtn.addEventListener('click', () => {
            const newDesc = descInput.value;
            const newTime = timeInput.value || null;
            const success = callbacks.onEdit(task.id, newDesc, newTime);
            if (!success) {
                descInput.focus();
            }
        });
        
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'btn-icon btn-cancel';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.addEventListener('click', () => {
            // Restore original values and re-render
            callbacks.onEdit(task.id, originalDescription, originalTime);
        });
        
        actions.appendChild(saveBtn);
        actions.appendChild(cancelBtn);
        
        descInput.focus();
    }

    showEmptyState() {
        this.emptyStateElement.style.display = 'block';
        this.taskListElement.style.display = 'none';
    }

    hideEmptyState() {
        this.emptyStateElement.style.display = 'none';
        this.taskListElement.style.display = 'block';
    }

    showValidationMessage(message) {
        this.validationMessageElement.textContent = message;
    }

    clearValidationMessage() {
        this.validationMessageElement.textContent = '';
    }

    formatTime(time) {
        if (!time) return '';
        
        // Convert 24-hour time to 12-hour format
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        
        return `${displayHour}:${minutes} ${ampm}`;
    }
}
