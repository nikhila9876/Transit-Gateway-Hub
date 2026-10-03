export const STATUS_COLORS = {
  available: 'bg-green-50 text-green-700 border-green-200',
  running: 'bg-green-50 text-green-700 border-green-200',
  healthy: 'bg-green-50 text-green-700 border-green-200',
  associated: 'bg-blue-50 text-blue-700 border-blue-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  review: 'bg-amber-50 text-amber-700 border-amber-200',
  recommended: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  critical: 'bg-red-50 text-red-700 border-red-200',
  blocked: 'bg-red-50 text-red-700 border-red-200',
  enforced: 'bg-purple-50 text-purple-700 border-purple-200',
  stopped: 'bg-slate-100 text-slate-700 border-slate-200',
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? dateString : date.toLocaleString();
};

export const truncate = (text, maxLength = 30) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};
