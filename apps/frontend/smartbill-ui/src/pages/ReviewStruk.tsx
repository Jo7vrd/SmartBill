import { useState } from 'react'
import { Check, X, Edit2, Trash2 } from 'lucide-react'
import type { ScannedData, ScannedItem } from '../types' // Sesuaikan path import lu

interface Props {
    initialData: ScannedData
    onCancel: () => void
    onSave: (finalData: ScannedData) => void
}

export default function ReviewStruk({ initialData, onCancel, onSave }: Props) {
    const [data, setData] = useState<ScannedData>(initialData)

    const handleItemChange = (index: number, field: keyof ScannedItem, value: any) => {
        const newItems = [...data.items]
        newItems[index] = { ...newItems[index], [field]: value }
        
        const subTotal = newItems.reduce((acc, item) => acc + (item.price * (item.qty || 1)), 0)
        const newTotal = subTotal + data.tax
        
        setData({ ...data, items: newItems, grand_total: newTotal })
    }

    const handleDelete = (index: number) => {
        const newItems = data.items.filter((_, i) => i !== index)
        setData({ ...data, items: newItems })
    }

    return (
        <div className="flex flex-col h-dvh bg-[#f7f9f8] text-dark">
            {/* Header */}
            <div className="bg-white px-6 pt-14 pb-4 shadow-sm flex justify-between items-center z-10">
                <button onClick={onCancel} className="p-2 -ml-2 text-dark/60 active:scale-95">
                    <X size={24} />
                </button>
                <h1 className="font-bold text-lg">Cek Ulang AI</h1>
                <div className="w-10" /> {/* Spacer */}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
                    <label className="text-xs font-bold text-dark/50 uppercase tracking-wider mb-1 block">Nama Resto/Toko</label>
                    <input 
                        type="text"
                        value={data.merchant_name}
                        onChange={(e) => setData({...data, merchant_name: e.target.value})}
                        className="w-full text-xl font-bold bg-transparent border-b border-dashed border-gray-300 focus:outline-none focus:border-primary pb-1"
                    />
                </div>

                <div className="space-y-4 mb-24">
                    <h2 className="font-bold text-dark/70 px-1">Daftar Pesanan ({data.items.length})</h2>
                    
                    {data.items.map((item, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
                            <div className="flex justify-between items-start gap-3">
                                <input 
                                    value={item.item_name}
                                    onChange={(e) => handleItemChange(idx, 'item_name', e.target.value)}
                                    className="font-semibold flex-1 bg-transparent border-b border-transparent focus:border-gray-300 focus:outline-none"
                                />
                                <button onClick={() => handleDelete(idx)} className="text-red-400 p-1 bg-red-50 rounded-lg active:scale-95">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            
                            <div className="flex justify-between items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-dark/50">Qty:</span>
                                    <input 
                                        type="number" 
                                        value={item.qty}
                                        onChange={(e) => handleItemChange(idx, 'qty', parseInt(e.target.value) || 1)}
                                        className="w-12 text-center bg-gray-50 rounded-lg py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-dark/50">Rp</span>
                                    <input 
                                        type="number" 
                                        value={item.price}
                                        onChange={(e) => handleItemChange(idx, 'price', parseInt(e.target.value) || 0)}
                                        className="w-24 text-right bg-gray-50 rounded-lg py-1 px-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>
                            
                            {/* Kategori */}
                            <select 
                                value={item.category_name}
                                onChange={(e) => handleItemChange(idx, 'category_name', e.target.value)}
                                className="w-full text-sm bg-gray-50 py-2 px-3 rounded-xl text-dark/70 focus:outline-none"
                            >
                                {["Makan", "Belanja", "Kebersihan", "Tagihan", "Kesehatan", "Hiburan", "Pendidikan", "Transportasi", "Lain-lain"].map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-white border-t border-gray-100 p-6 pb-10 fixed bottom-0 left-0 right-0 z-20">
                <div className="flex justify-between items-end mb-4 px-1">
                    <span className="text-dark/60 font-medium">Total Estimasi</span>
                    <span className="text-2xl font-bold text-primary">Rp {data.grand_total.toLocaleString('id-ID')}</span>
                </div>
                <button 
                    onClick={() => onSave(data)}
                    className="w-full bg-primary text-white py-4 rounded-full font-bold text-lg flex justify-center items-center gap-2 active:scale-95 transition-transform shadow-lg shadow-primary/30"
                >
                    <Check size={20} />
                    Simpan ke Pesanan
                </button>
            </div>
        </div>
    )
}