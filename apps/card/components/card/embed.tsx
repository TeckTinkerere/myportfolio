'use client'

import { Play } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

/**
 * Click-to-load video and music. A YouTube iframe pulls in around a
 * megabyte before anyone presses play; on a card opened from an NFC tap over
 * mobile data that is most of the page weight. Until the visitor taps, this
 * shows a thumbnail (YouTube) or a button (Spotify) and loads nothing else.
 */
export function Embed({ src, preview }: { src: string; preview: boolean }) {
  const [active, setActive] = useState(false)
  const spotify = src.includes('spotify.com')
  const youtubeId = spotify ? null : src.split('/embed/')[1]?.split(/[?&]/)[0]
  const title = spotify ? 'Spotify player' : 'YouTube video'

  if (active && !preview) {
    return (
      <iframe
        src={spotify ? src : `${src}?autoplay=1`}
        title={title}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        className={`w-full ${spotify ? 'h-[152px]' : 'aspect-video'}`}
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setActive(true)}
      className={`card-focus group relative grid w-full place-items-center overflow-hidden bg-[color:var(--c-surface)] ${spotify ? 'h-20' : 'aspect-video'}`}
    >
      {youtubeId && (
        <Image
          src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
          alt=""
          fill
          sizes="480px"
          className="object-cover opacity-90 transition group-hover:opacity-100"
        />
      )}
      <span className="relative flex items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-sm font-medium text-white">
        <Play className="h-4 w-4 fill-current" aria-hidden />
        {spotify ? 'Play on Spotify' : 'Play video'}
      </span>
    </button>
  )
}
