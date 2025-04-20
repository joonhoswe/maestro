"use client"

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/utils/supabase'
import { MusicIcon, Upload, File, ExternalLink, ChevronDown, ChevronUp, X, Plus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";

export default function SheetMusic() {
  // Updated types to match new schema
  const [musicPieces, setMusicPieces] = useState<any[]>([])
  const [instruments, setInstruments] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [composer, setComposer] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [expandedPieces, setExpandedPieces] = useState<{[key: string]: boolean}>({})
  
  // For adding new piece
  const [instrumentSlots, setInstrumentSlots] = useState<{instrumentId: string, slotLabel: string}[]>([])
  
  // For uploading parts
  const [selectedPieceInstrument, setSelectedPieceInstrument] = useState<{pieceId: string, pieceInstrumentId: string, slotLabel: string} | null>(null)
  
  // For adding new slots to existing pieces
  const [addingSlotToPiece, setAddingSlotToPiece] = useState<string | null>(null)
  const [newSlotInstrumentId, setNewSlotInstrumentId] = useState<string>('')
  const [newSlotLabel, setNewSlotLabel] = useState<string>('')
  
  // For deletion
  const [deletingPiece, setDeletingPiece] = useState<{id: string, title: string} | null>(null)
  const [deletingPart, setDeletingPart] = useState<{id: string, pieceInstrumentId: string, slotLabel: string} | null>(null)
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchMusicPieces()
    fetchInstruments()
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

  async function fetchInstruments() {
    try {
      const { data, error } = await supabase
        .from('instruments')
        .select('*')
        .order('name')
      
      if (error) throw error
      setInstruments(data || [])
    } catch (error) {
      console.error('Error fetching instruments:', error)
    }
  }

  async function fetchMusicPieces() {
    try {
      // Fetch music pieces with their required instruments and parts
      const { data: piecesData, error: piecesError } = await supabase
        .from('music_pieces')
        .select('*')
        .order('created_at', { ascending: false })

      if (piecesError) throw piecesError

      // For each piece, fetch its instrument slots and uploaded parts
      const enhancedPieces = await Promise.all(
        (piecesData || []).map(async (piece) => {
          // Get all piece_instruments records for this piece
          const { data: pieceInstrumentsData, error: pieceInstrumentsError } = await supabase
            .from('piece_instruments')
            .select(`
              id,
              slot_label,
              instruments (id, name)
            `)
            .eq('piece_id', piece.id)
            .order('slot_label')

          if (pieceInstrumentsError) throw pieceInstrumentsError

          // For each piece_instrument, get the uploaded parts (if any)
          const pieceInstrumentsWithParts = await Promise.all(
            (pieceInstrumentsData || []).map(async (pieceInstrument) => {
              // Explicitly select all fields including file_url
              const { data: partsData, error: partsError } = await supabase
                .from('instrument_parts')
                .select('id, piece_instrument_id, file_path, file_url, uploaded_at')
                .eq('piece_instrument_id', pieceInstrument.id)
                .order('uploaded_at', { ascending: false })
                .limit(1) // Just get the latest upload for this instrument slot

              if (partsError) throw partsError

              // Debug logging to check the part data
              if (partsData && partsData.length > 0) {
                console.log(`Part for instrument ${pieceInstrument.slot_label}:`, partsData[0]);
              }

              return {
                ...pieceInstrument,
                part: partsData && partsData.length > 0 ? partsData[0] : null
              }
            })
          )

          return {
            ...piece,
            pieceInstruments: pieceInstrumentsWithParts
          }
        })
      )

      setMusicPieces(enhancedPieces || [])
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
    
    // Validate form based on context
    if (!file) {
      setMessage({ text: 'Please provide a file', type: 'error' })
      return
    }
    
    if (!selectedPieceInstrument && !addingSlotToPiece && (!title || instrumentSlots.length === 0)) {
      setMessage({ text: 'Please provide a title and at least one instrument slot', type: 'error' })
      return
    }

    if (addingSlotToPiece && (!newSlotInstrumentId || !newSlotLabel)) {
      setMessage({ text: 'Please provide an instrument and slot label', type: 'error' })
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

      // 2. Get the public URL - we need this to store in the database
      const { data: urlData } = supabase.storage
        .from('sheet-music')
        .getPublicUrl(filePath)
        
      console.log("Generated URL from Storage:", urlData.publicUrl);
      
      // 3. Add records to database based on context
      if (selectedPieceInstrument) {
        // This is an upload for an existing instrument slot
        const { data: partData, error: partError } = await supabase
          .from('instrument_parts')
          .insert([
            {
              piece_instrument_id: selectedPieceInstrument.pieceInstrumentId,
              file_path: filePath,
              file_url: urlData.publicUrl // Manually set the URL
            }
          ])
          .select('id, piece_instrument_id, file_path, file_url, uploaded_at')
          
        if (partError) throw partError
        
        console.log("Uploaded part data:", partData);
      } else if (addingSlotToPiece) {
        // This is adding a new slot to an existing piece and uploading a file for it
        
        // First, create the new piece_instrument record
        const { data: pieceInstrumentData, error: pieceInstrumentError } = await supabase
          .from('piece_instruments')
          .insert([
            {
              piece_id: addingSlotToPiece,
              instrument_id: newSlotInstrumentId,
              slot_label: newSlotLabel
            }
          ])
          .select()
          
        if (pieceInstrumentError) throw pieceInstrumentError
        
        // Then, create the instrument_part record
        const { data: partData, error: partError } = await supabase
          .from('instrument_parts')
          .insert([
            {
              piece_instrument_id: pieceInstrumentData[0].id,
              file_path: filePath,
              file_url: urlData.publicUrl // Manually set the URL
            }
          ])
          .select('id, piece_instrument_id, file_path, file_url, uploaded_at')
          
        if (partError) throw partError
        
        console.log("Added new slot and uploaded part data:", partData);
      } else {
        // This is a new music piece with instrument slots
        // 3a. Insert the music piece
        const { data: pieceData, error: pieceError } = await supabase
          .from('music_pieces')
          .insert([
            { 
              title, 
              composer, 
              file_path: filePath,
              file_url: urlData.publicUrl // Manually set the URL
            }
          ])
          .select()
          
        if (pieceError) throw pieceError
        
        const pieceId = pieceData[0].id
        
        // 3b. Insert the piece_instruments records
        const pieceInstrumentRecords = instrumentSlots.map(slot => ({
          piece_id: pieceId,
          instrument_id: slot.instrumentId,
          slot_label: slot.slotLabel
        }))
        
        const { error: slotsError } = await supabase
          .from('piece_instruments')
          .insert(pieceInstrumentRecords)
          
        if (slotsError) throw slotsError
      }
      
      // 4. Reset form and refresh list
      setMessage({ text: 'Music uploaded successfully!', type: 'success' })
      setTitle('')
      setComposer('')
      setFile(null)
      setInstrumentSlots([])
      setSelectedPieceInstrument(null)
      setAddingSlotToPiece(null)
      setNewSlotInstrumentId('')
      setNewSlotLabel('')
      setShowUploadForm(false)
      
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

  const addInstrumentSlot = () => {
    setInstrumentSlots([...instrumentSlots, { instrumentId: instruments[0]?.id || '', slotLabel: '' }])
  }

  const updateInstrumentSlot = (index: number, field: 'instrumentId' | 'slotLabel', value: string) => {
    const updatedSlots = [...instrumentSlots]
    updatedSlots[index][field] = value
    setInstrumentSlots(updatedSlots)
  }

  const removeInstrumentSlot = (index: number) => {
    setInstrumentSlots(instrumentSlots.filter((_, i) => i !== index))
  }

  const togglePieceExpansion = (pieceId: string) => {
    setExpandedPieces(prev => ({
      ...prev,
      [pieceId]: !prev[pieceId]
    }));
  }

  const openUploadForPart = (pieceId: string, pieceInstrumentId: string, slotLabel: string) => {
    setSelectedPieceInstrument({
      pieceId,
      pieceInstrumentId,
      slotLabel
    })
    setShowUploadForm(true)
  }

  // Function to delete a music piece
  const deleteMusicPiece = async (pieceId: string, filePath: string) => {
    try {
      setIsDeleting(true)
      console.log(`Starting deletion of music piece: ${pieceId}, file: ${filePath}`)
      
      // 1. Delete the file from storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('sheet-music')
        .remove([filePath])
      
      if (storageError) {
        console.error("Error deleting file from storage:", storageError)
        // Continue with database deletion even if storage deletion fails
        // The file might not exist or have a different path
      } else {
        console.log("Storage deletion result:", storageData)
      }
      
      // 2. Delete the piece record (will cascade delete piece_instruments and instrument_parts)
      const { data: deleteData, error: deleteError } = await supabase
        .from('music_pieces')
        .delete()
        .eq('id', pieceId)
        .select()
      
      if (deleteError) throw deleteError
      
      console.log("Database deletion successful:", deleteData)
      
      // 3. Update local state
      setMusicPieces(prev => prev.filter(piece => piece.id !== pieceId))
      setExpandedPieces(prev => {
        const updated = { ...prev }
        delete updated[pieceId]
        return updated
      })
      
      setMessage({ text: 'Music piece deleted successfully from database and storage', type: 'success' })
    } catch (error) {
      console.error('Error deleting music piece:', error)
      setMessage({ text: 'Error deleting music piece. See console for details.', type: 'error' })
    } finally {
      setIsDeleting(false)
      setDeletingPiece(null)
      setDeleteConfirmationId(null)
    }
  }
  
  // Function to delete an instrument part
  const deleteInstrumentPart = async (partId: string, pieceInstrumentId: string, filePath: string) => {
    try {
      setIsDeleting(true)
      console.log(`Starting deletion of instrument part: ${partId}, file: ${filePath}`)
      
      // 1. Delete the file from storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('sheet-music')
        .remove([filePath])
      
      if (storageError) {
        console.error("Error deleting file from storage:", storageError)
        // Continue with database deletion even if storage deletion fails
      } else {
        console.log("Storage deletion result:", storageData)
      }
      
      // 2. Delete the part record
      const { data: deleteData, error: deleteError } = await supabase
        .from('instrument_parts')
        .delete()
        .eq('id', partId)
        .select()
      
      if (deleteError) throw deleteError

      // 3. Delete the instrument slot
      const { data: slotDeleteData, error: slotDeleteError } = await supabase
        .from('piece_instruments')
        .delete()
        .eq('id', pieceInstrumentId)
        .select()
      
      if (slotDeleteError) throw slotDeleteError
      
      console.log("Database deletion successful:", deleteData)
      console.log("Slot deletion successful:", slotDeleteData)
      
      // 4. Update local state - completely remove the slot from UI
      setMusicPieces(prev => 
        prev.map(piece => ({
          ...piece,
          pieceInstruments: piece.pieceInstruments.filter((pi: any) => pi.id !== pieceInstrumentId)
        }))
      )
      
      setMessage({ text: 'Instrument part deleted successfully', type: 'success' })
    } catch (error) {
      console.error('Error deleting instrument part:', error)
      setMessage({ text: 'Error deleting instrument part. See console for details.', type: 'error' })
    } finally {
      setIsDeleting(false)
      setDeletingPart(null)
      setDeleteConfirmationId(null)
    }
  }

  return (
    <div className="p-8 relative w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Sheet Music</h1>
        <Button 
          onClick={() => {
            setSelectedPieceInstrument(null);
            setShowUploadForm(true);
          }}
          className="flex items-center gap-2 bg-[#800020] hover:bg-[#600010] text-white"
        >
          <Upload className="w-4 h-4" />
          <span>Upload New Piece</span>
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
              className="relative z-10 w-full max-w-xl mx-4 overflow-auto max-h-[90vh] rounded-lg shadow-xl"
            >
              <div className="relative p-6 bg-white dark:bg-gray-950">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Upload className="mr-2 h-5 w-5" /> 
                    {selectedPieceInstrument 
                      ? `Upload ${selectedPieceInstrument.slotLabel} Part` 
                      : addingSlotToPiece 
                        ? "Add New Instrument Slot" 
                        : "Upload New Sheet Music"}
                  </h2>
                  <button 
                    onClick={() => {
                      setShowUploadForm(false);
                      setSelectedPieceInstrument(null);
                      setAddingSlotToPiece(null);
                    }}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!selectedPieceInstrument && !addingSlotToPiece ? (
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
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Instrument Slots *
                          </label>
                          <button
                            type="button"
                            onClick={addInstrumentSlot}
                            className="text-xs flex items-center gap-1 text-[#800020] dark:text-[#ff9393]"
                          >
                            <Plus className="h-3 w-3" /> Add Slot
                          </button>
                        </div>
                        
                        {instrumentSlots.length === 0 ? (
                          <p className="text-sm text-gray-500 italic mb-2">Add at least one instrument slot</p>
                        ) : (
                          <div className="space-y-3">
                            {instrumentSlots.map((slot, index) => (
                              <div key={index} className="flex gap-2 items-center">
                                <select
                                  value={slot.instrumentId}
                                  onChange={(e) => updateInstrumentSlot(index, 'instrumentId', e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                                  required
                                >
                                  {instruments.map(instrument => (
                                    <option key={instrument.id} value={instrument.id}>
                                      {instrument.name}
                                    </option>
                                  ))}
                                </select>
                                <input
                                  type="text"
                                  placeholder="Slot Label (e.g. First Violin)"
                                  value={slot.slotLabel}
                                  onChange={(e) => updateInstrumentSlot(index, 'slotLabel', e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={() => removeInstrumentSlot(index)}
                                  className="p-2 text-red-500 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  ) : selectedPieceInstrument ? (
                    <div>
                      <p className="mb-4 text-sm">
                        Uploading sheet music for <span className="font-semibold">{selectedPieceInstrument.slotLabel}</span> part.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm">
                        Adding a new instrument slot to this piece.
                      </p>
                      
                      <div>
                        <label htmlFor="slotInstrument" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Instrument *
                        </label>
                        <select
                          id="slotInstrument"
                          value={newSlotInstrumentId}
                          onChange={(e) => setNewSlotInstrumentId(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                          required
                        >
                          <option value="">Select an instrument</option>
                          {instruments.map(instrument => (
                            <option key={instrument.id} value={instrument.id}>
                              {instrument.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="slotLabel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Slot Label *
                        </label>
                        <input
                          type="text"
                          id="slotLabel"
                          placeholder="e.g. First Violin, Lead Singer"
                          value={newSlotLabel}
                          onChange={(e) => setNewSlotLabel(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                          required
                        />
                      </div>
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
                    {uploading 
                      ? 'Uploading...' 
                      : selectedPieceInstrument 
                        ? 'Upload Part' 
                        : addingSlotToPiece 
                          ? 'Add Slot and Upload' 
                          : 'Upload New Piece'}
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
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setDeletingPiece({ id: piece.id, title: piece.title });
                        setDeleteConfirmationId(piece.id);
                      }}
                      className="p-1.5 rounded-full text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                      aria-label="Delete piece"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {/* Delete confirmation */}
                {deleteConfirmationId === piece.id && (
                  <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
                    <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                      Are you sure you want to delete "{piece.title}"? This cannot be undone.
                    </p>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setDeleteConfirmationId(null)}
                        className="px-2 py-1 text-xs rounded-md text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                        disabled={isDeleting}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => deleteMusicPiece(piece.id, piece.file_path)}
                        className="px-2 py-1 text-xs rounded-md text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                )}
                
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
                          setAddingSlotToPiece(piece.id);
                          setShowUploadForm(true);
                        }}
                        className="text-xs text-[#800020] dark:text-[#ff9393] hover:text-[#600010] dark:hover:text-[#ffbaba] flex items-center"
                      >
                        <Upload className="h-3 w-3 mr-1" /> Add Part
                      </button>
                    </div>
                    
                    {piece.pieceInstruments && piece.pieceInstruments.length > 0 ? (
                      <div className="space-y-2">
                        {piece.pieceInstruments.map((pieceInstrument: any) => {
                          // Debug log for each instrument to see what data we have
                          if (pieceInstrument.part) {
                            console.log(`Displaying part for ${pieceInstrument.slot_label}:`, pieceInstrument.part);
                          }
                          
                          // Pre-calculate the URL to ensure it exists
                          const partUrl = pieceInstrument.part?.file_url || null;
                          
                          return (
                            <div key={pieceInstrument.id} className="relative">
                              {/* Delete confirmation for this part */}
                              {deleteConfirmationId === pieceInstrument.part?.id && (
                                <div className="mb-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
                                  <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                                    Delete {pieceInstrument.slot_label} part?
                                  </p>
                                  <div className="flex justify-end gap-2">
                                    <button
                                      onClick={() => setDeleteConfirmationId(null)}
                                      className="px-2 py-1 text-xs rounded-md text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                                      disabled={isDeleting}
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => deleteInstrumentPart(
                                        pieceInstrument.part.id, 
                                        pieceInstrument.id, 
                                        pieceInstrument.part.file_path
                                      )}
                                      className="px-2 py-1 text-xs rounded-md text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
                                      disabled={isDeleting}
                                    >
                                      {isDeleting ? "Deleting..." : "Delete"}
                                    </button>
                                  </div>
                                </div>
                              )}
                              
                              <div className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 p-2 rounded-md transition-colors">
                                <File className="h-4 w-4 text-[#800020] dark:text-[#ff9393]" />
                                
                                {pieceInstrument.part ? (
                                  <>
                                    <a 
                                      href={partUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="flex-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm cursor-pointer"
                                      onClick={(e) => {
                                        // Debug logging
                                        console.log("Opening part with URL:", partUrl);
                                        if (!partUrl) {
                                          e.preventDefault();
                                          console.error("No file URL available for:", pieceInstrument.part);
                                        }
                                      }}
                                    >
                                      <span>{pieceInstrument.slot_label} ({pieceInstrument.instruments.name})</span>
                                    </a>
                                    
                                    <div className="flex items-center gap-1">
                                      <a
                                        href={partUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                        onClick={(e) => {
                                          if (!partUrl) {
                                            e.preventDefault();
                                            console.error("No file URL available");
                                          }
                                        }}
                                      >
                                        <ExternalLink className="h-3.5 w-3.5" />
                                      </a>
                                      
                                      <button
                                        onClick={() => {
                                          setDeletingPart({
                                            id: pieceInstrument.part.id,
                                            pieceInstrumentId: pieceInstrument.id,
                                            slotLabel: pieceInstrument.slot_label
                                          });
                                          setDeleteConfirmationId(pieceInstrument.part.id);
                                        }}
                                        className="text-red-500 hover:text-red-700 p-1"
                                        aria-label={`Delete ${pieceInstrument.slot_label} part`}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </button>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <span className="flex-1 text-gray-500 dark:text-gray-400 text-sm">
                                      {pieceInstrument.slot_label} ({pieceInstrument.instruments.name}) - Not uploaded
                                    </span>
                                    
                                    <button
                                      onClick={() => openUploadForPart(piece.id, pieceInstrument.id, pieceInstrument.slot_label)}
                                      className="text-[#800020] dark:text-[#ff9393] hover:text-[#600010]"
                                    >
                                      <Upload className="h-3.5 w-3.5" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                        No instrument parts defined
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