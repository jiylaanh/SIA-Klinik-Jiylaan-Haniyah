import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

const data = [
  { name: 'Jan', income: 40000, expense: 24000 },
  { name: 'Feb', income: 30000, expense: 13980 },
  { name: 'Mar', income: 20000, expense: 9800 },
  { name: 'Apr', income: 27800, expense: 39080 },
  { name: 'Mei', income: 18900, expense: 4800 },
  { name: 'Jun', income: 23900, expense: 3800 },
];

const cashFlowData = data.map(item => ({
  ...item,
  net: item.income - item.expense
}));

const StatCard: React.FC<{ title: string; value: string; trend: string; isPositive: boolean; icon: React.ReactNode }> = ({ title, value, trend, isPositive, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${isPositive ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
        {icon}
      </div>
    </div>
    <div className="flex items-center gap-1 text-sm">
      <span className={isPositive ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}>
        {trend}
      </span>
      <span className="text-slate-400">dari bulan lalu</span>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Ikhtisar Keuangan Klinik</h2>
        <p className="text-slate-500">Pemantauan performa keuangan berbasis akrual (Real-time)</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total Pendapatan (Bulan Ini)" 
          value="Rp 145.200.000" 
          trend="+12.5%" 
          isPositive={true}
          icon={<DollarSign size={20} />}
        />
        <StatCard 
          title="Total Beban Operasional" 
          value="Rp 82.450.000" 
          trend="-2.4%" 
          isPositive={true} 
          icon={<TrendingDown size={20} />}
        />
        <StatCard 
          title="Laba Bersih" 
          value="Rp 62.750.000" 
          trend="+8.1%" 
          isPositive={true} 
          icon={<Activity size={20} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Income vs Expense Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Analisis Pendapatan vs Beban</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(value) => `Rp${value/1000}k`} />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="income" name="Pendapatan" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" name="Beban" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cash Flow Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Visualisasi Arus Kas Bersih (Net Cash Flow)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={cashFlowData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(value) => `Rp${value/1000}k`} />
                  <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    formatter={(value: number) => [`Rp ${value.toLocaleString()}`, 'Arus Kas Bersih']}
                  />
                  <Area type="monotone" dataKey="net" stroke="#3b82f6" fillOpacity={1} fill="url(#colorNet)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Pengingat Sistem</h3>
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-md">
                <p className="text-sm font-semibold text-amber-800">Validasi Jurnal Diperlukan</p>
                <p className="text-xs text-amber-700 mt-1">3 transaksi pengeluaran kas kecil belum diposting ke buku besar.</p>
              </div>
              <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-md">
                <p className="text-sm font-semibold text-blue-800">Rekonsiliasi Bank</p>
                <p className="text-xs text-blue-700 mt-1">Jadwal rekonsiliasi bulanan akan jatuh tempo dalam 2 hari.</p>
              </div>
              <div className="p-4 bg-slate-50 border-l-4 border-slate-400 rounded-r-md">
                <p className="text-sm font-semibold text-slate-800">Penyusutan Aset</p>
                <p className="text-xs text-slate-600 mt-1">Kalkulasi penyusutan otomatis peralatan medis telah selesai.</p>
              </div>
            </div>
          </div>

          <div className="bg-emerald-600 p-6 rounded-xl shadow-md text-white">
            <h3 className="font-bold text-lg mb-2">Butuh Bantuan Akuntansi?</h3>
            <p className="text-emerald-100 text-sm mb-4">Tanyakan pada AI Core untuk analisis mendalam mengenai arus kas ini.</p>
            <button className="w-full py-2 bg-white text-emerald-700 font-semibold rounded-lg text-sm hover:bg-emerald-50 transition-colors">
              Tanya AI Core
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;