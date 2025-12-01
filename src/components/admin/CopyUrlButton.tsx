'use client';

interface CopyUrlButtonProps {
  url: string;
}

export default function CopyUrlButton({ url }: CopyUrlButtonProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    alert('Payment proof URL copied to clipboard!');
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold transition"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      Copy URL
    </button>
  );
}
