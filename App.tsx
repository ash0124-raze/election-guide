@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
}

body {
  @apply bg-slate-50 text-slate-900 antialiased;
}

.glass-card {
  @apply bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm rounded-2xl;
}

.step-indicator {
  @apply w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  @apply bg-slate-200 rounded-full hover:bg-slate-300;
}
