export default function ItemRow({ name, price, assignees }: { name: string, price: string, assignees: string[] }) {
  const users = ['L', 'S', 'J'];
  return (
    <div className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors px-2 rounded-lg">
      <div>
        <p className="font-semibold text-gray-900">{name}</p>
        <p className="text-sm text-gray-500 font-medium">Rp {price}</p>
      </div>
      <div className="flex gap-2">
        {users.map(u => (
          <button 
            key={u} 
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all active:scale-90
              ${assignees.includes(u) 
                ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                : 'bg-white text-gray-400 border-gray-200'}`}
          >
            {u}
          </button>
        ))}
      </div>
    </div>
  );
}