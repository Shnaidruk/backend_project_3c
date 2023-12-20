const express = require('express');
const app = express();
const port = 3000;

const initializeApp = require('./modules/init');
const viewsRouter = require('./modules/views');

initializeApp();

app.use(express.json());
app.use('/', viewsRouter);


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
