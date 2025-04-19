import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import { MusicIcon } from "lucide-react";

export default function SheetMusic() {
  const [musicPieces, setMusicPieces] = useState<any[]>([])

  useEffect(() => {
    async function fetchMusicPieces() {
      const { data, error } = await supabase
        .from('music_pieces')
        .select('*')

      if (error) {
        console.error('Error fetching music pieces:', error)
      } else {
        setMusicPieces(data)
      }
    }

    fetchMusicPieces()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Sheet Music</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {musicPieces.map((piece, index) => (
          <div
            key={index}
            className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <MusicIcon className="h-5 w-5 text-blue-600" />
              <span className="text-gray-800 text-lg">{piece.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}