"use client"

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/utils/supabase'
import { MusicIcon, Upload, File, ExternalLink } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

export default function SheetMusic() {
  const [musicPieces, setMusicPieces] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [composer, setComposer] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchMusicPieces()
  }, [])

  async function fetchMusicPieces() {
    const { data, error } = await supabase
      .from('music_pieces')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching music pieces:', error)
    } else {
      setMusicPieces(data || [])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!file || !title) {
      setMessage({ text: 'Please provide a title and file', type: 'error' })
      return
    }

    try {
      setUploading(true)
      
      // 1. Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = `music/${fileName}`
      
      const { error: uploadError } = await supabase.storage
        .from('sheet-music')
        .upload(filePath, file)
        
      if (uploadError) throw uploadError

      // 2. Get the public URL
      const { data: urlData } = supabase.storage
        .from('sheet-music')
        .getPublicUrl(filePath)
        
      // 3. Add record to the music_pieces table
      const { error: dbError } = await supabase
        .from('music_pieces')
        .insert([
          { 
            title, 
            composer, 
            file_path: filePath,
            file_url: urlData.publicUrl 
          }
        ])
        
      if (dbError) throw dbError
      
      // 4. Reset form and refresh list
      setMessage({ text: 'Music piece uploaded successfully!', type: 'success' })
      setTitle('')
      setComposer('')
      setFile(null)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      fetchMusicPieces()
      
    } catch (error) {
      console.error('Error uploading music:', error)
      setMessage({ text: 'Error uploading music piece', type: 'error' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Sheet Music</h1>
      
      {/* Upload Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Upload className="mr-2 h-5 w-5" /> Upload Sheet Music
        </h2>
        
        {message.text && (
          <div className={`p-3 rounded mb-4 ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="composer" className="block text-sm font-medium text-gray-700 mb-1">
              Composer
            </label>
            <input
              type="text"
              id="composer"
              value={composer}
              onChange={(e) => setComposer(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
              PDF File *
            </label>
            <input
              type="file"
              id="file"
              accept=".pdf"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={uploading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Music'}
          </button>
        </form>
      </div>
      
      {/* Music Pieces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {musicPieces.map((piece, index) => (
          <div
            key={index}
            className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <MusicIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <span className="text-gray-800 text-lg font-medium">{piece.title}</span>
              </div>
              
              {piece.composer && (
                <div className="text-gray-600 ml-8">
                  Composer: {piece.composer}
                </div>
              )}
              
              {piece.file_url && (
                <a 
                  href={piece.file_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 ml-8 mt-2"
                >
                  <File className="h-4 w-4" />
                  <span>View Sheet Music</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}