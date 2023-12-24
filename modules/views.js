
const express = require('express');
const {v4: uuidv4} = require('uuid');
const router = express.Router();

const User = require('../models/user');
const Category = require('../models/category');
const Record = require('../models/record');
const Wallet = require('../models/wallet');


const { userPostSchema,  userGetSchema} = require('../schemas/user_schema');
const { categoryPostSchema, categoryGetSchema } = require('../schemas/category_schema');
const recordSchema = require('../schemas/record_schema');
const { walletPostSchema, walletGetSchema, walletRaiseSchema } = require('../schemas/wallet_schema');


router.post('/user', async (req, res) => {
    const { user_name } = req.body;

    const validationResult = userPostSchema.validate({ user_name });

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

router.get('/users', async (req, res) => {
    try {
      const users = await User.findAll();
  
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


router.get('/user/:user_id', async (req, res) => {
    const uId = req.params.user_id;

    const validationResult = userGetSchema.validate({ uId });

        if (validationResult.error) {
            return res.status(400).json({ error: validationResult.error.details[0].message });
        }


    try {
        const curUser = await User.findByPk(uId);

        if (!curUser) {
            return res.status(404).json({ error: 'No user with such user_id' });
        }

        res.status(200).json(curUser);
    } catch (error) {
        console.error(`Error fetching user with user_id ${uId}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/user/:user_id', async (req, res) => {
    const uId = req.params.user_id;
  
    const validationResult = userGetSchema.validate({ uId });

    if (validationResult.error) {
        return res.status(400).json({ error: validationResult.error.details[0].message });
    }

    try {
      const deletedUser = await User.findByPk(uId);
  
      if (!deletedUser) {
        return res.status(404).json({ error: 'No user with such user_id' });
      }
  
      await deletedUser.destroy();
  
      res.status(200).json(deletedUser);
    } catch (error) {
      console.error(`Error deleting user with user_id ${uId}:`, error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


router.post('/category', async (req, res) => {
    try {
      const { cat_name } = req.body;
  
      const validationResult = categoryPostSchema.validate({ cat_name });
  
      if (validationResult.error) {
        return res.status(400).json({ error: validationResult.error.details[0].message });
    }

      
      const category = await Category.create({
        cat_name,
      });
  
      res.status(201).json(category);
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/categories', async (req, res) => {
    
    try {
      const categories = await Category.findAll();
  
      res.status(200).json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/category/:cat_id', async (req, res) => {
    const cId = req.params.cat_id;

    const validationResult = categoryGetSchema.validate({ cat_id });
  
      if (validationResult.error) {
        return res.status(400).json({ error: validationResult.error.details[0].message });
    }
  
    try {
      const curCat = await Category.findByPk(cId);
  
      if (!curCat) {
        return res.status(404).json({ error: 'No category with such cat_id' });
      }
  
      res.status(200).json(curCat);
    } catch (error) {
      console.error(`Error fetching category with cat_id ${cId}:`, error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.delete('/category/:cat_id', async (req, res) => {
    const cId = req.params.cat_id;

    const validationResult = categoryGetSchema.validate({ cat_id });
  
      if (validationResult.error) {
        return res.status(400).json({ error: validationResult.error.details[0].message });
    }
  
    try {
      const deletedCategory = await Category.findByPk(cId);
  
      if (!deletedCategory) {
        return res.status(404).json({ error: 'No category with such cat_id' });
      }
  
      await deletedCategory.destroy();
  
      res.status(200).json(deletedCategory);
    } catch (error) {
      console.error(`Error deleting category with cat_id ${cId}:`, error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/record', async (req, res) => {
    const { uId, cId, amount } = req.body;
  
    const validationResult = recordSchema.validate({ uId, cId, amount });
  
        if (validationResult.error) {
          return res.status(400).json({ error: validationResult.error.details[0].message });
        }

    try {
      await sequelize.transaction(async (t) => {
        
        const user = await User.findByPk(uId);
        const category = await Category.findByPk(cId);
  
        if (!user || !category) {
            return res.status(400).json({ error: 'Invalid input' });
          }
  
        const record = await Record.create({
          user_id: uId,
          cat_id: cId,
          amount,
        }, { transaction: t });
  
        const wallet = await Wallet.findOne({
          where: { userId: uId },
          transaction: t,
        });
  
        wallet.balance -= amount;
        await wallet.save({ transaction: t });
  
        res.status(201).json(record);
      });
    } catch (error) {
      console.error('Error creating record:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.get('/records', (req, res) => {
    res.status(200).json(records)
});

router.get('/record', async (req, res) => {
    const { uId, cId } = req.query;
  
    try {
      
      const whereClause = {};
      if (uId) {
        whereClause.user_id = uId;
      }
      if (cId) {
        whereClause.cat_id = cId;
      }
  
      const filteredRecords = await Record.findAll({
        where: whereClause,
      });
  
      res.status(200).json(filteredRecords);
    } catch (error) {
      console.error('Error fetching records:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.delete('/record/:rec_id', async (req, res) => {
    const rId = req.params.rec_id;
  
    try {
      
      const deletedRecord = await Record.findByPk(rId);
  
      if (!deletedRecord) {
        return res.status(404).json({ error: 'No record with such rec_id' });
      }
  
      await deletedRecord.destroy();
  
      res.status(200).json(deletedRecord);
    } catch (error) {
      console.error(`Error deleting record with rec_id ${rId}:`, error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.post('/wallet', async (req, res) => {
    const { userId } = req.body;
  
    const validationResult = walletPostSchema.validate({ userId });
  
      if (validationResult.error) {
        return res.status(400).json({ error: validationResult.error.details[0].message });
      }

    try {
      
      const user = await User.findByPk(userId);
  
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }
  
      const existingWallet = await Wallet.findOne({
        where: { userId },
      });
  
      if (existingWallet) {
        return res.status(400).json({ error: 'Wallet already exists for this user' });
      }
  
      const wallet = await Wallet.create({
        userId,
        balance: 0,
      });
  
      res.status(201).json(wallet);
    } catch (error) {
      console.error('Error creating wallet:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.post('/raise/:user_id', async (req, res) => {
    const { user_id } = req.params;
    const { amount } = req.body;
  
    const validationResult = walletRaiseSchema.validate({ user_id, amount });
  
      if (validationResult.error) {
        return res.status(400).json({ error: validationResult.error.details[0].message });
      }

    try {
      let wallet = await Wallet.findOne({ where: { user_id } });
  
      if (!wallet) {
        wallet = await Wallet.create({ user_id, balance: 0 });
      }
  
      wallet.balance += amount;
      await wallet.save();
  
      res.status(200).json({ user_id, new_balance: wallet.balance });
    } catch (error) {
      console.error(`Error adding amount to balance for user_id ${user_id}:`, error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/balance/:user_id', async (req, res) => {
    const { user_id } = req.params;
  
    const validationResult = walletGetSchema.validate({ user_id});
  
      if (validationResult.error) {
        return res.status(400).json({ error: validationResult.error.details[0].message });
      }

    try {
      const wallet = await Wallet.findOne({ where: { user_id } });
  
      if (!wallet) {
        return res.status(404).json({ error: 'No wallet found for user_id' });
      }
  
      res.status(200).json({ user_id, balance: wallet.balance });
    } catch (error) {
      console.error(`Error fetching balance for user_id ${user_id}:`, error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.delete('/balance/:user_id', async (req, res) => {
    const { user_id } = req.params;

    const validationResult = walletGetSchema.validate({ user_id});
  
      if (validationResult.error) {
        return res.status(400).json({ error: validationResult.error.details[0].message });
      }
  
    try {
      const deletedWallet = await Wallet.findOne({ where: { user_id } });
  
      if (!deletedWallet) {
        return res.status(404).json({ error: 'No wallet found for user_id' });
      }
  
      await deletedWallet.destroy();
  
      res.status(200).json({ user_id, message: 'Wallet deleted successfully' });
    } catch (error) {
      console.error(`Error deleting wallet for user_id ${user_id}:`, error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
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
