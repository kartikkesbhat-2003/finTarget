# Task Queuing and Rate Limiting API

This API provides a task queuing system with rate limiting for handling user tasks. Each user is allowed to process one task per second and a maximum of 20 tasks per minute. Tasks that exceed these limits are queued and processed in the order they are received.


## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express**: Web framework for Node.js.
- **Node-Cache**: In-memory caching library to track rate limits and queues.

## Approach

### Rate Limiting

The rate limiting logic is implemented using `node-cache` to store the number of tasks a user has processed within the current second and minute.

- **`secondCount`**: Tracks the number of tasks processed within the current second.
- **`minuteCount`**: Tracks the number of tasks processed within the current minute.
- If the user exceeds the rate limit of 1 task per second or 20 tasks per minute, their subsequent tasks are queued.

### Task Queuing

Each user has their own task queue:

- Tasks are added to the user’s queue when received.
- The queue is processed sequentially, with a 1-second delay between each task to respect the rate limit.
- The queue is processed only if it has tasks and is not already being processed.

### Task Processing

- The `task` function simulates task processing by logging the user ID and timestamp to `task_log.txt`.
- Tasks are processed asynchronously, ensuring that the API remains responsive while handling multiple tasks.

### Graceful Shutdown

- The application listens for the `SIGINT` signal (e.g., when the server is stopped) and shuts down gracefully, ensuring that no tasks are lost.

## Key Functions

- **`createTask(req, res)`**:
  - Receives a task from the user.
  - Enforces the rate limits using `node-cache`.
  - Queues the task if the user has exceeded the rate limit.
  - Responds to the user with a message indicating whether the task is being processed or queued.

- **`processQueue(user_id)`**:
  - Processes tasks in the user's queue sequentially with a 1-second delay between tasks.
  - Continues processing the queue until all tasks are completed.

## How to Run
1. **Change Directory**:
   - Navigate to the project directory:
     ```bash
     cd "User Task Queuing with Rate Limiting"
     ```
     
2. **Install Dependencies**:
   ```bash
   npm install


3. **Start the Server**:
   ```bash
   npm run dev

4. **Send Task Requests**:
   ```json
   {
        "user_id": "123"
   }

5. **Monitor Task Processing**:

    Task completions are logged in `task_log.txt`.
