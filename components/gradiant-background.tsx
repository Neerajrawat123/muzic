export function GradientBackground() {
    return (
      <div
        className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-900 via-purple-950 to-indigo-950"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20" />
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-purple-500/10 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-gradient-to-t from-indigo-500/10 to-transparent blur-3xl" />
      </div>
    )
  }
  