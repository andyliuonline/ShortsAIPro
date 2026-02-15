import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { User, ShieldCheck, Mail, Calendar, Save } from "lucide-react";

export default function AdminUsers({ users }: any) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-200">使用者管理</h2>}
        >
            <Head title="User Management" />

            <div className="py-12 text-white">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-zinc-950 border-b border-zinc-800">
                                <tr>
                                    <th className="p-6 text-[10px] font-bold uppercase text-zinc-500 tracking-widest">基本資料</th>
                                    <th className="p-6 text-[10px] font-bold uppercase text-zinc-500 tracking-widest">目前方案</th>
                                    <th className="p-6 text-[10px] font-bold uppercase text-zinc-500 tracking-widest">剩餘點數</th>
                                    <th className="p-6 text-[10px] font-bold uppercase text-zinc-500 tracking-widest">註冊時間</th>
                                    <th className="p-6 text-[10px] font-bold uppercase text-zinc-500 tracking-widest text-right">操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800">
                                {users.data.map((user: any) => (
                                    <UserRow key={user.id} user={user} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function UserRow({ user }: { user: any }) {
    const { data, setData, post, processing } = useForm({
        plan: user.plan,
        credits: user.credits,
    });

    const submit = (e: any) => {
        e.preventDefault();
        post(route('admin.users.update-plan', user.id), {
            onSuccess: () => alert('方案已更新')
        });
    };

    return (
        <tr className="hover:bg-zinc-800/30 transition-colors">
            <td className="p-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-400">
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold text-sm text-white flex items-center gap-1">
                            {user.name} {user.is_admin && <ShieldCheck size={14} className="text-blue-500" />}
                        </p>
                        <p className="text-[10px] text-zinc-500">{user.email}</p>
                    </div>
                </div>
            </td>
            <td className="p-6">
                <select 
                    value={data.plan} 
                    onChange={e => setData('plan', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 rounded-lg text-xs font-bold text-white focus:ring-yellow-400"
                >
                    <option value="free">Free</option>
                    <option value="basic">Basic</option>
                    <option value="standard">Standard</option>
                    <option value="pro">Pro</option>
                    <option value="flagship">Flagship</option>
                </select>
            </td>
            <td className="p-6">
                <input 
                    type="number" 
                    value={data.credits}
                    onChange={e => setData('credits', parseInt(e.target.value))}
                    className="w-20 bg-zinc-800 border-zinc-700 rounded-lg text-xs font-bold text-white focus:ring-yellow-400"
                />
            </td>
            <td className="p-6">
                <span className="text-xs text-zinc-500">{new Date(user.created_at).toLocaleDateString()}</span>
            </td>
            <td className="p-6 text-right">
                <button 
                    onClick={submit}
                    disabled={processing}
                    className="bg-yellow-400 text-black px-4 py-2 rounded-lg text-xs font-black hover:bg-yellow-300 transition-all flex items-center gap-2 ml-auto"
                >
                    {processing ? <User className="animate-spin" size={14}/> : <Save size={14}/>}
                    更新
                </button>
            </td>
        </tr>
    );
}
