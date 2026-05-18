export default function VideoBackground() {
  return (
    <div
      className="
        fixed
        inset-0
        overflow-hidden
        z-0
      "
    >

      {/* Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="
          absolute
          w-full
          h-full
          object-cover
        "
      >
        <source
          src="/videos/background.mp4"
          type="video/mp4"
        />
      </video>

      {/* Dark Overlay */}
      <div
        className="
          absolute
          inset-0
          bg-[#050816]/70
        "
      />

      {/* Purple Glow */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-br
          from-purple-500/10
          via-transparent
          to-cyan-500/10
        "
      />

      {/* Vignette */}
      <div
        className="
          absolute
          inset-0
          bg-black/30
        "
      />
    </div>
  )
}