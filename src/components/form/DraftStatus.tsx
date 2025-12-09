'use client';

interface DraftStatusProps {
  hasDraft: boolean;
  onClearDraft: () => void;
}

export default function DraftStatus({ hasDraft, onClearDraft }: DraftStatusProps) {
  if (!hasDraft) return null;
  
  return (
    <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-700 flex items-center justify-between">
      <span>💾 Draft auto-saved! Your progress is secure.</span>
      <button
        onClick={onClearDraft}
        className="text-red-500 hover:text-red-700 font-medium underline"
      >
        Clear
      </button>
    </div>
  );
}
