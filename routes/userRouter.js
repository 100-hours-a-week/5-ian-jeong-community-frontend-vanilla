import path from 'path';
import express from 'express';



const router = express.Router();
const __dirname = path.resolve();


router.get('/sign-in', (req, res) => {
    res.sendFile(path.join(__dirname, 'view/sign-in.html'));
});

router.get('/sign-up', (req, res) => {
    res.sendFile(path.join(__dirname, 'view/sign-up.html'));
});

router.get('/:userId', (req, res) => {
    res.sendFile(path.join(__dirname, 'view/edit-user.html'));
});

router.get('/:userId/password', (req, res) => {
    res.sendFile(path.join(__dirname, 'view/edit-password.html'));
});


export default router;