import React from 'react';
import { MOCK_TRANSACTIONS } from '../constants';

const JournalEntry: React.FC = () => {
  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50">
      <header className="mb-8 flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Jurnal Umum</h2>
           <p className="text-slate-500">Daftar transaksi yang telah diposting</p>
        </div>
        <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-700">
            Export Excel
        </button>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600 font-medium">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Tanggal</th>
              <th className="p-4">Keterangan</th>
              <th className="p-4">Kategori</th>
              <th className="p-4 text-right">Debit</th>
              <th className="p-4 text-right">Kredit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_TRANSACTIONS.map((trx) => (
              <tr key={trx.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 text-slate-500">#{trx.id.toString().padStart(4, '0')}</td>
                <td className="p-4 text-slate-700">{trx.date}</td>
                <td className="p-4 font-medium text-slate-800">{trx.description}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-semibold">
                    {trx.category}
                  </span>
                </td>
                <td className="p-4 text-right font-mono text-slate-600">
                  {trx.type === 'debit' ? `Rp ${trx.amount.toLocaleString('id-ID')}` : '-'}
                </td>
                <td className="p-4 text-right font-mono text-slate-600">
                  {trx.type === 'credit' ? `Rp ${trx.amount.toLocaleString('id-ID')}` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JournalEntry;
