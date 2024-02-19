/* REST version which will probably never be used */

import Post from './../models/post.mjs'


/*
export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find({ state: 'published' })
        res.status(200).json(posts)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const getPost = async (req, res) => {
    const post = await Post.findById(req.params.id)
        .where('state')
        .eq('published')
    
    if (!post) {
        return res.status(404).json({
            status: 'Failed',
            message: 'Post with given Id not found',
        })
    } else {
        post.readCount === 0 ? post.readCount++ : post.readCount++
        await post.save()
    }
    
    res.status(200).json(post)
}
    
export const createPost = async (req, res) => {
  const post = new Post(req.body)
  try {
    await post.save()
    res.status(201).json(post)
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
}*/