# Design Document

## Overview

The Daily Planner is a single-page web application built with vanilla HTML, CSS, and JavaScript. It provides a clean, intuitive interface for managing daily tasks with time slots, completion tracking, and persistent storage. The application follows a simple client-side architecture with no backend dependencies, using browser Local Storage for data persistence.

## Architecture

The application follows a modular JavaScript architecture with clear separation of concerns:

- **Presentation Layer**: HTML structure and CSS styling for the user interface
- **Application Logic**: JavaScript modules handling task management, UI updates, and user interactions
- **Data Layer**: Local Storage interface for persistence

The architecture is event-driven, with user interactions triggering updates to the task list, which then propagate to both the UI and storage layers.

## Components and Interfaces

### HTML Structure

The main HTML file (`index.html`) contains:
- Header section with date display
- Task input form with fields for description and optional time
- Task list container for displaying all tasks
- Empty state message (shown when no tasks exist)

### CSS Styling

The stylesheet (`styles.css`) provides:
- Responsive layout using flexbox/grid
- Visual states for task completion (strikethrough, opacity changes)
- Hover effects for interactive elements
- Mobile-responsive design with media queries
- Color scheme and typography for readability

### JavaScript Modules

**TaskManager Module** (`taskManager.js`):
- Manages the in-memory task list array
- Provides methods: `addTask()`, `deleteTask()`, `updateTask()`, `toggleComplete()`, `getTasks()`
- Handles task sorting by time slot
- Generates unique IDs for tasks

**StorageManager Module** (`storageManager.js`):
- Interfaces with browser Local Storage
- Methods: `saveTasks()`, `loadTasks()`, `clearTasks()`
- Handles JSON serialization/deserialization
- Implements error handling for corrupted data

**UIManager Module** (`uiManager.js`):
- Handles all DOM manipulation
- Methods: `renderTasks()`, `renderTask()`, `updateDate()`, `showEmptyState()`, `hideEmptyState()`
- Attaches event listeners to UI elements
- Manages form validation and user feedback

**DateManager Module** (`dateManager.js`):
- Formats and displays current date
- Implements midnight detection for date updates
- Provides consistent date formatting across the application

## Data Models

### Task Object

```javascript
{
  id: string,           // Unique identifier (timestamp-based or UUID)
  description: string,  // Task description (non-empty)
  time: string | null,  // Optional time slot in "HH:MM" format
  completed: boolean,   // Completion status
  createdAt: number     // Timestamp of creation
}
```

### Task List

The task list is an array of Task objects stored in memory and persisted to Local Storage as JSON:

```javascript
[
  { id: "1", description: "Morning meeting", time: "09:00", completed: false, createdAt: 1234567890 },
  { id: "2", description: "Lunch", time: "12:00", completed: false, createdAt: 1234567891 }
]
```

### Local Storage Schema

- Key: `"dailyPlannerTasks"`
- Value: JSON stringified array of Task objects


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Adding valid tasks increases list length

*For any* task list and any valid (non-empty) task description, adding the task should increase the task list length by exactly one.

**Validates: Requirements 1.1**

### Property 2: Whitespace-only descriptions are rejected

*For any* string composed entirely of whitespace characters (spaces, tabs, newlines), attempting to add it as a task description should be rejected, and the task list should remain unchanged.

**Validates: Requirements 1.2, 5.5**

### Property 3: Input field is cleared after task addition

*For any* UI state where the task input field contains text, successfully adding a task should result in the input field being empty and focused.

**Validates: Requirements 1.3**

### Property 4: Task persistence round-trip

*For any* valid task with all properties (description, time, completion status), saving it to storage and then loading from storage should return a task with equivalent properties.

**Validates: Requirements 1.4, 6.1, 6.2**

### Property 5: Task rendering includes all properties

*For any* task, the rendered HTML output should contain the task's description, and if a time slot is specified, the time should also be present in the rendered output.

**Validates: Requirements 1.5, 2.2**

### Property 6: Tasks can be created with or without time slots

*For any* valid task description, the system should successfully create tasks both with a specified time slot and without a time slot (null/undefined).

**Validates: Requirements 2.1**

### Property 7: Tasks are sorted chronologically by time

*For any* collection of tasks where at least some have time slots, the sorted task list should be ordered chronologically, with tasks having earlier times appearing before tasks with later times.

**Validates: Requirements 2.3**

### Property 8: Time slot modifications persist

*For any* existing task, editing its time slot to a new value should result in the task having the updated time slot in both memory and storage.

**Validates: Requirements 2.4**

### Property 9: Duplicate time slots are preserved

*For any* set of tasks where multiple tasks share the same time slot, all tasks with that time slot should appear in the rendered task list.

**Validates: Requirements 2.5**

### Property 10: Toggle completion is idempotent after two applications

*For any* task, toggling its completion status twice should return it to its original completion state.

**Validates: Requirements 3.1**

### Property 11: Completed tasks have distinct styling

*For any* task marked as completed, the rendered HTML should include CSS classes or styles that visually distinguish it from incomplete tasks.

**Validates: Requirements 3.2, 7.5**

### Property 12: All modifications persist to storage

*For any* task operation (add, delete, edit, toggle completion), the operation should be immediately reflected in Local Storage, such that reloading the page shows the updated state.

**Validates: Requirements 3.3, 4.2, 5.3, 6.4**

### Property 13: Completion preserves task in list

*For any* task list, marking a task as complete should not change the length of the task list.

**Validates: Requirements 3.5**

### Property 14: Deletion removes task from list and storage

*For any* task in the task list, deleting it should reduce the list length by one, remove it from the rendered UI, and remove it from Local Storage.

**Validates: Requirements 4.1, 4.2, 4.3**

### Property 15: Edit mode enables modification

*For any* task, entering edit mode should allow modification of both the description and time slot fields, and saving should update the task with the new values.

**Validates: Requirements 5.1, 5.2, 5.3**

### Property 16: Cancel editing restores original values

*For any* task, entering edit mode, making changes, and then canceling should leave the task with its original values unchanged.

**Validates: Requirements 5.4**

### Property 17: Date display includes required components

*For any* date displayed in the interface, the formatted string should include the day of the week, month name, and day number.

**Validates: Requirements 8.1, 8.2**

### Property 18: Date formatting is consistent

*For any* multiple instances of date display in the interface, all should use the same formatting pattern.

**Validates: Requirements 8.4**

## Error Handling

The application implements graceful error handling at multiple levels:

### Input Validation
- Empty or whitespace-only task descriptions are rejected with user-friendly messages
- Invalid time formats are handled with appropriate feedback
- Form submission is prevented when validation fails

### Storage Errors
- Corrupted Local Storage data triggers a fallback to empty task list initialization
- JSON parsing errors are caught and logged, with graceful degradation
- Storage quota exceeded errors are handled with user notification

### Runtime Errors
- Missing DOM elements are checked before manipulation
- Event listener errors are caught to prevent application crashes
- Null/undefined checks are performed on task operations

### User Feedback
- Validation errors display inline messages near the relevant input
- Success operations provide subtle visual feedback
- Error states are clearly communicated without disrupting the user experience

## Testing Strategy

The Daily Planner will employ a dual testing approach combining unit tests and property-based tests to ensure comprehensive correctness validation.

### Unit Testing

Unit tests will verify specific examples and integration points:

- Specific task creation scenarios (with/without time, various descriptions)
- Edge cases like empty task lists, midnight date transitions
- DOM manipulation and event handling
- Local Storage integration with mock storage
- Date formatting with specific date examples

Unit tests will use a lightweight testing framework appropriate for vanilla JavaScript (e.g., Jest or Vitest) and will focus on concrete examples that demonstrate correct behavior.

### Property-Based Testing

Property-based tests will verify the universal correctness properties defined above. We will use **fast-check** as the property-based testing library for JavaScript.

**Configuration requirements:**
- Each property-based test MUST run a minimum of 100 iterations
- Each test MUST be tagged with a comment referencing the correctness property from this design document
- Tag format: `// Feature: daily-planner, Property {number}: {property_text}`
- Each correctness property MUST be implemented by a SINGLE property-based test

**Property test coverage:**
- Task list operations (add, delete, edit, toggle)
- Input validation across various whitespace patterns
- Persistence round-trips with randomly generated tasks
- Sorting behavior with various time configurations
- UI rendering with diverse task data
- Idempotence properties (toggle, cancel edit)

Property-based tests will generate random task data including:
- Random descriptions (various lengths, special characters)
- Random time slots (valid and edge case times)
- Random completion states
- Random task list sizes

### Test Organization

Tests will be organized in a `tests/` directory:
- `tests/unit/` - Unit tests for specific scenarios
- `tests/properties/` - Property-based tests for universal properties
- `tests/helpers/` - Test utilities and generators for property tests

### Testing Workflow

1. Implement core functionality
2. Write property-based tests for universal correctness properties
3. Write unit tests for specific examples and edge cases
4. Run tests continuously during development
5. Ensure all tests pass before considering a feature complete

## Implementation Notes

### Technology Stack
- HTML5 for semantic structure
- CSS3 with Flexbox/Grid for responsive layout
- Vanilla JavaScript (ES6+) for application logic
- Local Storage API for persistence
- No external dependencies or frameworks

### Browser Compatibility
- Target modern browsers (Chrome, Firefox, Safari, Edge)
- Use standard Web APIs without polyfills
- Graceful degradation for older browsers

### Performance Considerations
- Minimize DOM manipulation by batching updates
- Use event delegation for task list interactions
- Debounce storage operations if needed for large task lists
- Lazy rendering for large numbers of tasks

### Accessibility
- Semantic HTML elements for screen reader support
- ARIA labels for interactive elements
- Keyboard navigation support
- Sufficient color contrast for readability
- Focus management for form interactions

### Future Enhancements
- Multiple day views (week/month)
- Task categories or tags
- Task priorities
- Recurring tasks
- Export/import functionality
- Dark mode theme
