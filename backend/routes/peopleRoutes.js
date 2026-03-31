const express = require('express');
const { getPeople, createPerson, updatePerson, deletePerson } = require('../controllers/peopleController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

// Only admins can manage users (People)
router.use(authMiddleware, adminMiddleware);

router.route('/')
  .get(getPeople)
  .post(createPerson);

router.route('/:id')
  .put(updatePerson)
  .delete(deletePerson);

module.exports = router;
