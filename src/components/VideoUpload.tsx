import React, { useRef, useState } from 'react'
import { X, Video, AlertCircle, CheckCircle } from 'lucide-react'

interface VideoUploadProps {
  onVideoUpload: (videoBlob: Blob) => void
  maxDuration?: number
  onError?: (error: string) => void
}

export default function VideoUpload({ 
  onVideoUpload, 
  maxDuration = 15, 
  onError 
}: VideoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string>('')
  const [duration, setDuration] = useState<number>(0)
  const [error, setError] = useState<string>('')
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('video/')) {
      const errorMsg = 'Please select a video file'
      setError(errorMsg)
      onError?.(errorMsg)
      return
    }

    const url = URL.createObjectURL(file)
    setSelectedFile(file)
    setVideoUrl(url)
    setError('')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDurationCheck = () => {
    if (videoRef.current) {
      const videoDuration = videoRef.current.duration
      setDuration(videoDuration)
      
      if (videoDuration > maxDuration) {
        const errorMsg = `Video exceeds maximum duration of ${maxDuration} seconds`
        setError(errorMsg)
        onError?.(errorMsg)
      } else {
        setError('')
      }
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    try {
      // Check duration again before upload
      if (duration > maxDuration) {
        throw new Error(`Video exceeds maximum duration of ${maxDuration} seconds`)
      }

      // Convert file to blob for upload
      const videoBlob = new Blob([selectedFile], { type: selectedFile.type })
      onVideoUpload(videoBlob)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to process video'
      setError(errorMsg)
      onError?.(errorMsg)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      })
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9,opus'
      })
      
      mediaRecorderRef.current = mediaRecorder
      recordedChunksRef.current = []
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data)
        }
      }
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' })
        const file = new File([blob], 'recorded-video.webm', { type: 'video/webm' })
        handleFileSelect(file)
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorder.start()
      setIsRecording(true)
      
      // Auto-stop after max duration
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop()
          setIsRecording(false)
        }
      }, maxDuration * 1000)
      
    } catch (err) {
      const errorMsg = 'Failed to access camera. Please check permissions.'
      setError(errorMsg)
      onError?.(errorMsg)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const resetSelection = () => {
    setSelectedFile(null)
    setVideoUrl('')
    setDuration(0)
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      {/* File Upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="hidden"
        />
        
        {!selectedFile ? (
          <div className="space-y-3">
            <Video className="w-12 h-12 text-gray-400 mx-auto" />
            <p className="text-sm text-gray-600">
              Select a video file or record directly
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Choose File
              </button>
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isRecording 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isRecording ? 'Stop Recording' : 'Record Video'}
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Maximum duration: {maxDuration} seconds
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              onLoadedMetadata={handleDurationCheck}
              className="w-full max-h-48 rounded-lg mx-auto"
            />
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Duration: {duration.toFixed(1)}s / {maxDuration}s
              </span>
              
              {duration > 0 && duration <= maxDuration && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              </div>
            )}
            
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={resetSelection}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Change Video
              </button>
              <button
                type="button"
                onClick={handleUpload}
                disabled={!!error || duration === 0 || duration > maxDuration}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Use This Video
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
