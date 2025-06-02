import express from 'express';

import { getAllPosts, createPost, getPostById, updatePost, deletePost } from '../controllers/postController.js';

import { authenticate } from '../middlewares/authMiddleware.js';
import  {upload}  from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Route to get all posts
router
	.route("/")
	.get(getAllPosts)
	.post(authenticate, upload.single("image"), createPost);

// Route to get a post by ID
router.route('/:id')
    .get(getPostById)
    .put(authenticate, updatePost)
    .delete(authenticate, deletePost);
    

export default router;