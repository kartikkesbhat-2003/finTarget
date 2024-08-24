const express = require('express');
const taskRoutes = require('./routes/task');
const dotenv = require('dotenv');

const app = express();
app.use(express.json());

app.use('/api/v1', taskRoutes);

dotenv.config();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
