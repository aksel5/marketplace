import { useState, useCallback } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

export interface VideoCompressionResult {
  success: boolean;
  compressedVideo?: Blob;
  error?: string;
  duration?: number;
  size?: number;
}

export function useVideoCompression() {
  const [ffmpeg] = useState(() => new FFmpeg());
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string>('');

  const initializeFFmpeg = useCallback(async () => {
    if (isReady) return;
    
    try {
      setIsLoading(true);
      await ffmpeg.load();
      setIsReady(true);
      setError('');
    } catch (error: any) {
      console.error('Failed to initialize FFmpeg:', error);
      setError('FFmpeg initialization failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [ffmpeg, isReady]);

  const compressVideo = useCallback(async (
    videoFile: File, 
    maxDuration: number = 15
  ): Promise<VideoCompressionResult> => {
    setIsLoading(true);
    setError('');
    
    try {
      if (!isReady) {
        await initializeFFmpeg();
      }

      console.log('Starting video compression...');

      // Write the input file to FFmpeg
      await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile));
      console.log('Input file written');

      // Get video duration using proper FFmpeg command
      await ffmpeg.exec(['-i', 'input.mp4', '-f', 'null', '-']);
      
      // For WebAssembly FFmpeg, we need to handle duration differently
      // Let's use a simple approach - just trim to maxDuration from start
      
      // Compress and trim video
      const command = [
        '-i', 'input.mp4',
        '-t', maxDuration.toString(),
        '-vf', 'scale=640:-2',
        '-c:v', 'libx264',
        '-preset', 'fast',
        '-crf', '23',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-y', // Overwrite output file
        'output.mp4'
      ];

      console.log('Executing FFmpeg command:', command);
      
      const exitCode = await ffmpeg.exec(command);
      console.log('FFmpeg exit code:', exitCode);

      if (exitCode !== 0) {
        throw new Error(`FFmpeg process failed with exit code ${exitCode}`);
      }

      // Read the compressed video
      const compressedData = await ffmpeg.readFile('output.mp4');
      const compressedBlob = new Blob([compressedData], { type: 'video/mp4' });

      console.log('Compression successful, output size:', compressedBlob.size);

      // Clean up
      try {
        await ffmpeg.deleteFile('input.mp4');
        await ffmpeg.deleteFile('output.mp4');
      } catch (cleanupError) {
        console.warn('Cleanup error:', cleanupError);
      }

      setIsLoading(false);
      
      return {
        success: true,
        compressedVideo: compressedBlob,
        duration: maxDuration,
        size: compressedBlob.size
      };

    } catch (error: any) {
      console.error('Video compression error:', error);
      setIsLoading(false);
      setError(error.message || 'Failed to compress video');
      
      return {
        success: false,
        error: error.message || 'Failed to compress video'
      };
    }
  }, [ffmpeg, isReady, initializeFFmpeg]);

  const createScrollingVideo = useCallback(async (
    videoFile: File,
    options?: {
      maxDuration?: number;
      width?: number;
      height?: number;
    }
  ): Promise<VideoCompressionResult> => {
    const maxDuration = options?.maxDuration || 15;
    const targetWidth = options?.width || 640;
    const targetHeight = options?.height || 360;

    setIsLoading(true);
    setError('');
    
    try {
      if (!isReady) {
        await initializeFFmpeg();
      }

      console.log('Creating scrolling video...');

      // Write the input file to FFmpeg
      await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile));

      // Use simple crop and scale for scrolling effect
      const command = [
        '-i', 'input.mp4',
        '-t', maxDuration.toString(),
        '-vf', `scale=${targetWidth}:${targetHeight}:force_original_aspect_ratio=decrease,pad=${targetWidth}:${targetHeight}:(ow-iw)/2:(oh-ih)/2`,
        '-c:v', 'libx264',
        '-preset', 'fast',
        '-crf', '23',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-y',
        'output.mp4'
      ];

      console.log('Executing scrolling video command:', command);
      
      const exitCode = await ffmpeg.exec(command);
      console.log('FFmpeg exit code:', exitCode);

      if (exitCode !== 0) {
        throw new Error(`FFmpeg process failed with exit code ${exitCode}`);
      }

      // Read the compressed video
      const compressedData = await ffmpeg.readFile('output.mp4');
      const compressedBlob = new Blob([compressedData], { type: 'video/mp4' });

      console.log('Scrolling video created successfully');

      // Clean up
      try {
        await ffmpeg.deleteFile('input.mp4');
        await ffmpeg.deleteFile('output.mp4');
      } catch (cleanupError) {
        console.warn('Cleanup error:', cleanupError);
      }

      setIsLoading(false);
      
      return {
        success: true,
        compressedVideo: compressedBlob,
        duration: maxDuration,
        size: compressedBlob.size
      };

    } catch (error: any) {
      console.error('Scrolling video creation error:', error);
      setIsLoading(false);
      setError(error.message || 'Failed to create scrolling video');
      
      return {
        success: false,
        error: error.message || 'Failed to create scrolling video'
      };
    }
  }, [ffmpeg, isReady, initializeFFmpeg]);

  return {
    compressVideo,
    createScrollingVideo,
    isLoading,
    isReady,
    error,
    initializeFFmpeg
  };
}
