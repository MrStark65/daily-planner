export class DateManager {
    constructor() {
        this.dateElement = document.getElementById('current-date');
        this.midnightCheckInterval = null;
    }

    updateDate() {
        const now = new Date();
        const formatted = this.formatDate(now);
        if (this.dateElement) {
            this.dateElement.textContent = formatted;
        }
    }

    formatDate(date) {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('en-US', options);
    }

    startMidnightCheck(callback) {
        // Check every minute for date change
        this.midnightCheckInterval = setInterval(() => {
            const now = new Date();
            const currentDate = now.toDateString();
            const storedDate = this.getStoredDate();
            
            if (currentDate !== storedDate) {
                this.setStoredDate(currentDate);
                callback();
            }
        }, 60000); // Check every minute
        
        // Store initial date
        this.setStoredDate(new Date().toDateString());
    }

    getStoredDate() {
        return sessionStorage.getItem('currentDate');
    }

    setStoredDate(dateString) {
        sessionStorage.setItem('currentDate', dateString);
    }

    stopMidnightCheck() {
        if (this.midnightCheckInterval) {
            clearInterval(this.midnightCheckInterval);
        }
    }
}
