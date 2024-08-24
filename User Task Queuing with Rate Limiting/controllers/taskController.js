const express = require('express');
const NodeCache = require('node-cache');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const cache = new NodeCache();

const userQueues = {};

async function task(user_id) {
  const logMessage = `${user_id} - task completed at - ${Date.now()}\n`;
  fs.appendFileSync(path.join(__dirname, '../task_log.txt'), logMessage);
  console.log(logMessage.trim());
}

const createTask = async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).send("User ID is required");
  }

  const currentSecond = Math.floor(Date.now() / 1000);
  const currentMinute = Math.floor(Date.now() / 60000);

  let userRateLimit = cache.get(user_id);
  if (!userRateLimit) {
    userRateLimit = {
      secondCount: 0,
      minuteCount: 0,
      lastSecond: currentSecond,
      lastMinute: currentMinute
    };
    cache.set(user_id, userRateLimit, 60);
  }

  if (userRateLimit.lastSecond !== currentSecond) {
    userRateLimit.lastSecond = currentSecond;
    userRateLimit.secondCount = 0;
  }
  if (userRateLimit.lastMinute !== currentMinute) {
    userRateLimit.lastMinute = currentMinute;
    userRateLimit.minuteCount = 0;
  }

  if (userRateLimit.secondCount >= 1 || userRateLimit.minuteCount >= 20) {
    return res.status(429).send("Rate limit exceeded. Your task has been queued.");
  }

  userRateLimit.secondCount++;
  userRateLimit.minuteCount++;

  cache.set(user_id, userRateLimit);

  if (!userQueues[user_id]) {
    userQueues[user_id] = [];
  }

  userQueues[user_id].push(() => task(user_id));

  if (userQueues[user_id].length === 1) {
    processQueue(user_id);
  }

  res.send("Task is being processed.");
};

async function processQueue(user_id) {
  if (!userQueues[user_id] || userQueues[user_id].length === 0) {
    return;
  }

  try {
    const currentTask = userQueues[user_id].shift();
    await currentTask();

    setTimeout(() => processQueue(user_id), 1000);
  } catch (error) {
    console.error("Error processing queue:", error);
  }
}

process.on('SIGINT', () => {
  console.log('Server shutting down gracefully');
  process.exit(0);
});

module.exports = {
  createTask,
};
