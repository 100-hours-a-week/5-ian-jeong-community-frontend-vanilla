import express from 'express';
import path from 'path';

const router = express.Router();
const __dirname = path.resolve();


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view/posts.html'));
});

router.get('/new', (req, res) => {
    res.sendFile(path.join(__dirname, '/view/add-post.html'));
});

router.get('/:postId', (req, res) => {
    res.sendFile(path.join(__dirname, '/view/post-detail.html'));
});

router.get('/:postId/edit', (req, res) => {
    res.sendFile(path.join(__dirname, 'view/edit-post.html'));
});

router.get('/:postId/password', (req, res) => {
    res.sendFile(path.join(__dirname, 'view/edit-password.html'));
});

export default router;




