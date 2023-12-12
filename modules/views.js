
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello, World, it`s my BACK-END project!');
});

module.exports = router;
