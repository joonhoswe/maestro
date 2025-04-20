"use client"

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/utils/supabase'
import { MusicIcon, Upload, File, ExternalLink, ChevronDown, ChevronUp, X } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";

export default function SheetMusic() {
  const [musicPieces, setMusicPieces] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [composer, setComposer] = useState('')
  const [instrumentName, setInstrumentName] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [expandedPieces, setExpandedPieces] = useState<{[key: string]: boolean}>({})
  const [activePieceForUpload, setActivePieceForUpload] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchMusicPieces()
  }, [])

  // Add effect to prevent body scrolling when modal is open
  useEffect(() => {
    if (showUploadForm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showUploadForm]);

  async function fetchMusicPieces() {
    try {
      // First fetch all music pieces
      const { data: piecesData, error: piecesError } = await supabase
        .from('music_pieces')
        .select('*')
        .order('created_at', { ascending: false })

      if (piecesError) throw piecesError

      // // For each piece, fetch its instrument parts
      // const enhancedPieces = await Promise.all(
      //   (piecesData || []).map(async (piece) => {
      //     const { data: partsData, error: partsError } = await supabase
      //       .from('instrument_parts')
      //       .select('*')
      //       .eq('piece_id', piece.id)
      //       .order('created_at', { ascending: true })

      //     if (partsError) throw partsError

      //     return {
      //       ...piece,
      //       instrumentParts: partsData || []
      //     }
      //   })
      // )

      setMusicPieces(piecesData || [])
    } catch (error) {
      console.error('Error fetching music pieces:', error)
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
        
      // 3. Add record to the music_pieces table or instrument_parts table
      if (instrumentName) {
        // If instrument name is provided, this is an instrument part for an existing piece
        const { error: partError } = await supabase
          .from('instrument_parts')
          .insert([
            {
              piece_id: activePieceForUpload,
              instrument_name: instrumentName,
              file_path: filePath,
              file_url: urlData.publicUrl
            }
          ])
          
        if (partError) throw partError
      } else {
        // This is a new music piece
        const { error: pieceError } = await supabase
          .from('music_pieces')
          .insert([
            { 
              title, 
              composer, 
              file_path: filePath,
              file_url: urlData.publicUrl 
            }
          ])
          
        if (pieceError) throw pieceError
      }
      
      // 4. Reset form and refresh list
      setMessage({ text: 'Music uploaded successfully!', type: 'success' })
      setTitle('')
      setComposer('')
      setInstrumentName('')
      setFile(null)
      setShowUploadForm(false)
      setActivePieceForUpload(null)
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
      fetchMusicPieces()
      
    } catch (error) {
      console.error('Error uploading music:', error)
      setMessage({ text: 'Error uploading music', type: 'error' })
    } finally {
      setUploading(false)
    }
  }

  const togglePieceExpansion = (pieceId: string) => {
    setExpandedPieces(prev => ({
      ...prev,
      [pieceId]: !prev[pieceId]
    }));
  }

  return (
    <div className="p-8 relative w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Sheet Music</h1>
        <Button 
          onClick={() => setShowUploadForm(true)}
          className="flex items-center gap-2 bg-[#800020] hover:bg-[#600010] text-white"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Music</span>
        </Button>
      </div>
      
      {message.text && (
        <div className={`p-3 mb-6 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
          {message.text}
        </div>
      )}
      
      {/* Modal Upload Form Overlay */}
      <AnimatePresence>
        {showUploadForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowUploadForm(false)}
            />
            
            {/* Form Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ 
                type: "spring",
                damping: 25,
                stiffness: 300,
              }}
              className="relative z-10 w-full max-w-xl mx-4 overflow-hidden rounded-lg shadow-xl"
            >
              <div className="relative p-6 bg-white dark:bg-gray-950">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Upload className="mr-2 h-5 w-5" /> 
                    {activePieceForUpload ? "Add Instrument Part" : "Upload Sheet Music"}
                  </h2>
                  <button 
                    onClick={() => {
                      setShowUploadForm(false);
                      setActivePieceForUpload(null);
                    }}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!activePieceForUpload ? (
                    <>
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Title *
                        </label>
                        <input
                          type="text"
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="composer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Composer
                        </label>
                        <input
                          type="text"
                          id="composer"
                          value={composer}
                          onChange={(e) => setComposer(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                    </>
                  ) : (
                    <div>
                      <label htmlFor="instrumentName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Instrument Name *
                      </label>
                      <input
                        type="text"
                        id="instrumentName"
                        value={instrumentName}
                        onChange={(e) => setInstrumentName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                        required
                      />
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="file" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      PDF File *
                    </label>
                    <input
                      type="file"
                      id="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={uploading}
                    className="w-full bg-[#800020] hover:bg-[#600010] text-white"
                  >
                    {uploading ? 'Uploading...' : activePieceForUpload ? 'Add Instrument Part' : 'Upload Music'}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Music Pieces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {musicPieces.map((piece) => (
          <div key={piece.id} className="mb-6">
            <div className="border border-[#800020]/30 dark:border-[#800020]/20 rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
              <div className="p-5 flex flex-col">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#800020]/10 dark:bg-[#800020]/20 rounded-full">
                      <MusicIcon className="h-5 w-5 text-[#800020] dark:text-[#ff9393]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{piece.title}</h3>
                      {piece.composer && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {piece.composer}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => togglePieceExpansion(piece.id)} 
                    className="p-1.5 rounded-full text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    {expandedPieces[piece.id] ? 
                      <ChevronUp className="h-5 w-5" /> : 
                      <ChevronDown className="h-5 w-5" />
                    }
                  </button>
                </div>
                
                {/* Main score link */}
                <div className="flex items-center gap-2 mt-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 p-2 rounded-md transition-colors">
                  <File className="h-4 w-4 text-[#800020] dark:text-[#ff9393]" />
                  <a 
                    href={piece.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                  >
                    <span>Full Score</span>
                  </a>
                  <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
                </div>
                
                {/* Button at the bottom remains fixed position */}
                <div className="mt-4">
                  <button 
                    onClick={() => togglePieceExpansion(piece.id)}
                    className="w-full p-2 text-sm flex items-center justify-center gap-2 text-[#800020] dark:text-[#ff9393] hover:bg-[#800020]/5 dark:hover:bg-[#800020]/10 rounded-md transition-colors" 
                  >
                    {expandedPieces[piece.id] ? (
                      <>Hide parts <ChevronUp className="h-4 w-4" /></>
                    ) : (
                      <>Show parts <ChevronDown className="h-4 w-4" /></>
                    )}
                  </button>
                </div>
                
                {/* Expanded content in separate section that doesn't affect card height */}
                <div className={`overflow-hidden transition-all duration-300 ${expandedPieces[piece.id] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-800 mt-4">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex justify-between items-center">
                      <span>Instrument Parts</span>
                      <button 
                        onClick={() => {
                          setActivePieceForUpload(piece.id);
                          setShowUploadForm(true);
                        }}
                        className="text-xs text-[#800020] dark:text-[#ff9393] hover:text-[#600010] dark:hover:text-[#ffbaba] flex items-center"
                      >
                        <Upload className="h-3 w-3 mr-1" /> Add Part
                      </button>
                    </div>
                    
                    {piece.instrumentParts && piece.instrumentParts.length > 0 ? (
                      <div className="space-y-2">
                        {piece.instrumentParts.map((part: any) => (
                          <div key={part.id} className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 p-2 rounded-md transition-colors">
                            <File className="h-4 w-4 text-[#800020] dark:text-[#ff9393]" />
                            <a 
                              href={part.file_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                            >
                              <span>{part.instrument_name}</span>
                            </a>
                            <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                        No instrument parts available
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Empty state */}
      {musicPieces.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <MusicIcon className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No sheet music yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md">
            Upload your first sheet music piece to get started.
          </p>
        </div>
      )}
    </div>
  );
}