import { authMiddleware } from '@/middleware/auth.middleware';
import { UserService } from '@/service/userService';
import { Hono } from 'hono';
import { updateSchema } from '@nihongolab/db';
import { zValidator } from '@hono/zod-validator';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});
const userController = new Hono();
const userService = new UserService();
// Apply Auth Middleware to ALL routes in this file
userController.use('*', authMiddleware);
// GET /api/users/me
userController.get('/me', async (c) => {
    const user = c.get('user');
    const profile = await userService.getProfile(user.id);
    return c.json(profile);
});
// PATCH /api/users/me
userController.patch('/me', zValidator('json', updateSchema), async (c) => {
    const user = c.get('user');
    const data = c.req.valid('json');
    const updatedUser = await userService.updateProfile(user.id, data);
    if (!updatedUser) {
        return c.json({ error: 'Update failed' }, 400);
    }
    return c.json(updatedUser);
});
// POST /api/users/upload-image - Cloudinary Upload (STREAM)
userController.post('/upload-image', async (c) => {
    try {
        const user = c.get('user');
        // Check Cloudinary configuration
        if (!process.env.CLOUDINARY_CLOUD_NAME ||
            !process.env.CLOUDINARY_API_KEY ||
            !process.env.CLOUDINARY_API_SECRET) {
            return c.json({ error: 'Server configuration error: Cloudinary credentials not set' }, 500);
        }
        // Parse multipart form data
        const formData = await c.req.formData();
        const file = formData.get('image');
        if (!file) {
            return c.json({ error: 'No image file provided' }, 400);
        }
        console.log('File received:', {
            name: file.name,
            type: file.type,
            size: file.size
        });
        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return c.json({ error: 'File size exceeds 5MB limit' }, 400);
        }
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return c.json({ error: 'Invalid file type. Only JPEG, PNG, and WEBP are allowed' }, 400);
        }
        console.log('Uploading to Cloudinary (stream)...');
        // Convert File → Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        // Upload via stream (NO base64)
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({
                folder: 'nihongolab/avatars',
                public_id: `user_${user.id}_${Date.now()}`,
                resource_type: 'image',
                transformation: [
                    { width: 400, height: 400, crop: 'fill', gravity: 'face' },
                    { quality: 'auto:good' },
                    { fetch_format: 'auto' }
                ],
                timeout: 60000 // 60s safety
            }, (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            });
            Readable.from(buffer).pipe(uploadStream);
        });
        console.log('Upload successful:', result.secure_url);
        return c.json({ imageUrl: result.secure_url });
    }
    catch (error) {
        console.error('Cloudinary upload error:', error);
        return c.json({
            error: error instanceof Error ? error.message : 'Failed to upload image'
        }, 500);
    }
});
export default userController;
