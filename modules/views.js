
const express = require('express');
const {v4: uuidv4} = require('uuid');
const router = express.Router();

router.post('/user', (req,res) =>{
    const {user_name} = req.body;

    if (!user_name){
        return res.status(400).json({error: 'Name is required'})
    }

    const user_id = uuidv4();

    const user = {
        user_id,
        user_name,
    };
    users.push(user);

    res.status(201).json(user);
});

router.get('/users', (req, res) => {
    res.status(200).json(users)
});

router.get('/user/<user_id>', (req, res) => {
    const uId = req.params.id;

    const curUser = users.find(user => user.id === uID);

    if (!curUser){
        return res.status(404).json({error: 'No user with such user_id'})
    }
    res.status(200).json(curUser);
});

router.delete('/user/<user_id>', (req, res) => {
    const uId = req.params.id;

    const curUser = users.find(user => user.id === uID);

    if (!curUser){
        return res.status(404).json({error: 'No user with such user_id'})
    }

    const delU = users.splice(curUser, 1)[0];

    res.status(200).json(delU);
});

router.get('/healthcheck', (req, res) => {
    const currentDate = new Date();
    const status = 'OK';

    res.status(200).json({
        date: currentDate.toISOString(),
        status: status,
    });
});

module.exports = router;
