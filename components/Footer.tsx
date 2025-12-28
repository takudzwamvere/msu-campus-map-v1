export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-gray-200 py-1.5 px-4 text-center z-[2000] relative">
      <p className="text-xs text-white flex items-center justify-center gap-1">
        Created with <span className="text-red-500 animate-pulse">❤️</span> by{" "}
        <a 
          href="https://github.com/takudzwamvere" 
          target="_blank" 
          rel="noopener noreferrer"
          className="font-medium text-white hover:text-blue-600 underline decoration-gray-300 underline-offset-2"
        >
          Takudzwa Mvere
        </a>
      </p>
    </footer>
  );
}
