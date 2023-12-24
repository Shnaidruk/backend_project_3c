
const express = require('express');
const {v4: uuidv4} = require('uuid');
const router = express.Router();


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
      // Видалення користувача за його ідентифікатором з бази даних за допомогою Sequelize
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
  
      const validationResult = categorySchema.validate({ cat_name });
  
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
  
    try {
      // Отримання категорії за її ідентифікатором з бази даних за допомогою Sequelize
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
  
    try {
      // Видалення категорії за її ідентифікатором з бази даних за допомогою Sequelize
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
      // Починаємо транзакцію Sequelize
      await sequelize.transaction(async (t) => {
        // Перевірка, чи існують користувач та категорія за допомогою Sequelize
        const user = await User.findByPk(uId);
        const category = await Category.findByPk(cId);
  
        if (!user || !category) {
            return res.status(400).json({ error: 'Invalid input' });
          }
  
        // Створення запису в таблиці Record
        const record = await Record.create({
          user_id: uId,
          cat_id: cId,
          amount,
        }, { transaction: t });
  
        // Отримуємо рахунок користувача
        const wallet = await Wallet.findOne({
          where: { userId: uId },
          transaction: t,
        });
  
        // Оновлюємо баланс рахунку користувача
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

rrouter.get('/record', async (req, res) => {
    const { uId, cId } = req.query;
  
    try {
      // Пошук записів за параметрами з бази даних за допомогою Sequelize
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
      // Видалення запису за ідентифікатором з бази даних за допомогою Sequelize
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
  
    const validationResult = walletSchema.validate({ userId });
  
      if (validationResult.error) {
        return res.status(400).json({ error: validationResult.error.details[0].message });
      }

    try {
      // Перевірка, чи користувач існує
      const user = await User.findByPk(userId);
  
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }
  
      // Перевірка, чи користувач вже має рахунок
      const existingWallet = await Wallet.findOne({
        where: { userId },
      });
  
      if (existingWallet) {
        return res.status(400).json({ error: 'Wallet already exists for this user' });
      }
  
      // Створення балансу користувача за замовчуванням
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



router.get('/healthcheck', (req, res) => {
    const currentDate = new Date();
    const status = 'OK';

    res.status(200).json({
        date: currentDate.toISOString(),
        status: status,
    });
});

module.exports = router;
