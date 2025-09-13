import React, { useState, useRef } from 'react';
import { Upload, Video, X, RotateCcw, AlertCircle } from 'lucide-react';
import { useVideoCompression } from '../hooks/useVideoCompression';

interface VideoUploadProps {
  onVideoUpload: (videoBlob: Blob) => void;
  maxDuration?: number;
  maxSize?: number;
}

export default function VideoUpload({ 
  onVideoUpload, 
  maxDuration = 15,
  maxSize = 50 * 1024 * 1024 // 50MB
}: VideoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { createScrollingVideo, isLoading, error: compressionError } = useVideoCompression();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setError('Please select a video file (MP4, MOV, AVI)');
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      setError(`File size must be less than ${maxSize / 1024 / 1024}MB`);
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleCompressAndUpload = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError('');

    try {
      console.log('Starting video compression for file:', selectedFile.name);
      
      const result = await createScrollingVideo(selectedFile, {
        maxDuration,
        width: 640,
        height: 360
      });

      console.log('Compression result:', result);

      if (result.success && result.compressedVideo) {
        console.log('Compression successful, uploading...');
        onVideoUpload(result.compressedVideo);
        setError('');
      } else {
        const errorMsg = result.error || 'Failed to compress video';
        setError(errorMsg);
        console.error('Compression failed:', errorMsg);
      }
    } catch (err: any) {
      const errorMsg = err.message || 'An error occurred during compression';
      setError(errorMsg);
      console.error('Compression error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Show compression errors from the hook
  React.useEffect(() => {
    if (compressionError) {
      setError(compressionError);
    }
  }, [compressionError]);

  return (
    <div className="space-y-4">
      {/* File Input */}
      {!selectedFile && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
            id="video-upload"
          />
          <label
            htmlFor="video-upload"
            className="cursor-pointer flex flex-col items-center space-y-3"
          >
            <Upload className="w-12 h-12 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Click to upload video
              </p>
              <p className="text-xs text-gray-500">
                MP4, MOV, AVI up to {maxSize / 1024 / 1024}MB
              </p>
            </div>
          </label>
        </div>
      )}

      {/* Preview */}
      {previewUrl && (
        <div className="relative">
          <video
            src={previewUrl}
            controls
            className="w-full rounded-lg border border-gray-200"
            style={{ maxHeight: '300px' }}
          />
          <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
            <span className="truncate max-w-xs">{selectedFile?.name}</span>
            <span>{formatFileSize(selectedFile?.size || 0)}</span>
          </div>
          
          <button
            onClick={handleRemoveFile}
            className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {selectedFile && (
        <div className="flex space-x-3">
          <button
            onClick={handleCompressAndUpload}
            disabled={isProcessing || isLoading}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isProcessing || isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Compressing...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Video className="w-4 h-4" />
                <span>Compress & Upload ({maxDuration}s)</span>
              </div>
            )}
          </button>
          
          <button
            onClick={handleRemoveFile}
            className="px-4 py-2 border border-gray-300 text-gray-600 hover:text-gray-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Video Requirements:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Maximum duration: {maxDuration} seconds</li>
          <li>• Maximum size: {maxSize / 1024 / 1024}MB</li>
          <li>• Supported formats: MP4, MOV, AVI</li>
          <li>• Video will be compressed to optimal size</li>
          <li>• Output: 640x360 resolution, 15 seconds max</li>
        </ul>
      </div>
    </div>
  );
}
