import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Users, CreditCard, TrendingUp, DollarSign, ArrowUpRight } from "lucide-react";

export default function AdminDashboard({ stats, recent_users }: any) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-200">超級管理員後台</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                    <Users size={24} />
                                </div>
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">總使用者</span>
                            </div>
                            <h4 className="text-3xl font-black text-white">{stats.total_users}</h4>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                                    <CreditCard size={24} />
                                </div>
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">付費訂閱</span>
                            </div>
                            <h4 className="text-3xl font-black text-white">{stats.active_subscriptions}</h4>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                                    <DollarSign size={24} />
                                </div>
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">總營收</span>
                            </div>
                            <h4 className="text-3xl font-black text-white">${stats.total_revenue.toLocaleString()}</h4>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Users */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
                            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                                <h3 className="font-bold text-white">最新註冊</h3>
                                <Link href={route('admin.users')} className="text-xs text-yellow-400 font-bold flex items-center gap-1">
                                    查看全部 <ArrowUpRight size={14} />
                                </Link>
                            </div>
                            <div className="divide-y divide-zinc-800">
                                {recent_users.map((user: any) => (
                                    <div key={user.id} className="p-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-400">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white">{user.name}</p>
                                                <p className="text-[10px] text-zinc-500">{user.email}</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold uppercase bg-zinc-800 px-2 py-1 rounded text-zinc-400">{user.plan}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Settings Link */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col justify-center items-center text-center">
                            <div className="w-20 h-20 rounded-3xl bg-yellow-400/10 flex items-center justify-center text-yellow-400 mb-6">
                                <TrendingUp size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">系統參數設定</h3>
                            <p className="text-zinc-500 text-sm mb-8 max-w-xs">
                                修改藍新金流、Giveme 發票以及 AI 生成模型等核心參數。
                            </p>
                            <Link 
                                href={route('admin.settings')}
                                className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-all"
                            >
                                進入系統設定
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
