const express = require('express');
const listController = require('../controllers/listController.js');
const router = express.Router();

router.get('/',listController.getAllPosts);
router.get('/write',listController.getWrite);
router.post('/write',listController.postWrite);
router.get('/detail/:id',listController.getDetail);
router.get('/edit/:id',listController.getEdit);
router.post('/edit/:id',listController.postEdit);
router.get('/delete/:id',listController.deletePost);

module.exports = router;