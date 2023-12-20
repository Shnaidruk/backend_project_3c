
const express = require('express');
const {v4: uuidv4} = require('uuid');
const router = express.Router();

const users = [];
const categories = [];
const records = [];

router.post('/user', (req,res) =>{
    const { user_name } = req.body;

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

router.get('/user/:user_id', (req, res) => {
    const uId = req.params.user_id;

    const curUser = users.find(user => user.user_id === uId);

    if (!curUser){
        return res.status(404).json({error: 'No user with such user_id'})
    }
    res.status(200).json(curUser);
});

router.delete('/user/:user_id', (req, res) => {
    const uId = req.params.user_id;

    const curUser = users.find(user => user.user_id === String(uId));

    if (!curUser){
        return res.status(404).json({error: 'No user with such user_id'})
    }

    const delU = users.splice(curUser, 1)[0];

    res.status(200).json(delU);
});


router.post('/category', (req, res) => {
    const {cat_name} = req.body;

    if (!cat_name){
        return res.status(400).json({error: 'Name is required'})
    }

    const cat_id = uuidv4();

    const category = {
        cat_id,
        cat_name,
    };
    categories.push(category);

    res.status(201).json(category);
});

router.get('/categories', (req, res) => {
    res.status(200).json(categories)
});

router.get('/category/:cat_id', (req, res) =>{
    const cId = req.params.cat_id;

    const curCat = categories.find(category => category.cat_id === cId);

    if (!curCat){
        return res.status(404).json({error: 'No category with such cat_id'})
    }
    res.status(200).json(curCat);
});

router.delete('/category/:cat_id', (req, res) => {
    const cId = req.params.cat_id;

    const curCat = categories.find(category => category.cat_id === cId);

    if (!curCat){
        return res.status(404).json({error: 'No category with such cat_id'})
    }

    const delC = categories.splice(curCat, 1)[0];

    res.status(200).json(delC);
});


router.post('/record', (req, res) => {
    const {uId, cId, amount} = req.body;

    const user = users.find(user => user.user_id === uId);
    const category = categories.find(category => category.cat_id === cId);

    if (!user || !category){
        return res.status(400).json({error: 'Invalid input'});
    }

    const rec_id = uuidv4();
    const record = {rec_id, uId, cId, amount, timestamp: Date.now().toString()};

    records.push(record);

    res.status(201).json(record);
});

router.get('/records', (req, res) => {
    res.status(200).json(records)
});

router.get('/record', (req,res) => {
    const{uId, cId} = req.query;

    if (!uId && !cId) {
        return res.status(400).json({ error: 'Please provide user_id and/or category_id' });
    }

    const filteredExpenses = records.filter(record =>
        (!uId || record.user_id === String(uId)) &&
        (!cId || record.cat_id === String(cId))
    );

    res.status(200).json(filteredExpenses);

} );

router.delete('/record/:rec_id', (req,res) => {
    const rId = req.params.rec_id;

    const curRec = records.find(record => record.rec_id === rId);

    if (!curRec){
        return res.status(404).json({error: 'No category with such rec_id'})
    }

    const delR = records.splice(curRec, 1)[0];

    res.status(200).json(delR);
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
