
const express = require('express');
const {v4: uuidv4} = require('uuid');
const router = express.Router();

const {User} = require("../models");
const userSchema = require("../schemas/user_schema");
const categorySchema = require("../schemas/category_schema");

const categories = [];
const records = [];

router.post('/user', async (req, res) => {
    const { user_name } = req.body;

    const validationResult = userSchema.validate({ user_name });

    if (validationResult.error) {
        return res.status(400).json({ error: validationResult.error.details[0].message });
    }

    try {
        const user = await User.create({ user_name });
        res.status(201).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
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


router.post('/category', async (req, res) => {
    try {
      const { cat_name } = req.body;
  
      const validationResult = userSchema.validate({ cat_name });
  
      
      const category = await Category.create({
        cat_name,
      });
  
      res.status(201).json(category);
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
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
