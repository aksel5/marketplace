/*
# Add Video Storage Support
1. Storage: Create product-videos bucket for compressed video uploads
2. Security: Add storage policies for video uploads and access
3. Schema: Add video_url column to products table
*/

-- Create storage bucket for product videos
INSERT INTO storage.buckets (id, name, public)
