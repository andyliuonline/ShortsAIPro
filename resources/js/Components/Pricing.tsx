import { Check } from "lucide-react";
import axios from "axios";
import { usePage } from "@inertiajs/react";

const plans = [
    {
        id: "basic",
        name: "入門版",
        price: "299",
        credits: "300",
        features: ["每月 300 支影片生成", "爆款影片分析", "智慧擷取畫面", "自動生成 Prompt", "一鍵自動上傳"],
        color: "zinc",
    },
    {
        id: "standard",
        name: "標準版",
        price: "449",
        credits: "600",
        features: ["每月 600 支影片生成", "爆款影片分析", "智慧擷取畫面", "自動生成 Prompt", "一鍵自動上傳", "SEO 標題優化"],
        color: "yellow",
        popular: true,
    },
    {
        id: "pro",
        name: "專業版",
        price: "769",
        credits: "1500",
        features: ["每月 1500 支影片生成", "多模型切換 (Sora/Kling)", "爆款影片分析", "智慧擷取畫面", "自動生成 Prompt", "一鍵自動上傳", "SEO 標題優化"],
        color: "orange",
    },
    {
        id: "flagship",
        name: "旗艦版",
        price: "1,049",
        credits: "無限",
        features: ["每月 無限 影片生成", "優先生成權限", "多頻道管理", "爆款影片分析", "智慧擷取畫面", "自動生成 Prompt", "一鍵自動上傳", "SEO 標題優化"],
        color: "blue",
    },
];

export default function Pricing() {
    const { auth } = usePage<any>().props;

    const handleCheckout = async (planId: string) => {
        if (!auth.user) {
            window.location.href = route('register');
            return;
        }
        try {
            const res = await axios.post('/payment/checkout', { plan: planId });
            const data = res.data;

            // Create a hidden form and submit it to NewebPay
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = data.ActionUrl;

            const fields = {
                MerchantID: data.MerchantID,
                TradeInfo: data.TradeInfo,
                TradeSha: data.TradeSha,
                Version: data.Version,
            };

            for (const [key, value] of Object.entries(fields)) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = value;
                form.appendChild(input);
            }

            document.body.appendChild(form);
            form.submit();
        } catch (err) {
            alert("啟動支付失敗，請重試");
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
                <div 
                    key={plan.id} 
                    className={`relative p-8 rounded-3xl bg-zinc-900 border ${plan.popular ? 'border-yellow-400' : 'border-zinc-800'} flex flex-col`}
                >
                    {plan.popular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                            最受歡迎
                        </div>
                    )}
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                        <p className="text-zinc-500 text-sm">每月 {plan.credits} 片</p>
                    </div>
                    <div className="mb-8">
                        <span className="text-4xl font-black text-white">${plan.price}</span>
                        <span className="text-zinc-500 ml-2">/ 月</span>
                    </div>
                    <ul className="space-y-4 mb-10 flex-grow">
                        {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-3 text-zinc-400 text-sm">
                                <Check size={16} className="text-green-500 shrink-0 mt-0.5" />
                                {feature}
                            </li>
                        ))}
                    </ul>
                    <button 
                        onClick={() => handleCheckout(plan.id)}
                        className={`w-full py-4 rounded-xl font-bold transition-all ${
                            plan.popular 
                            ? 'bg-yellow-400 text-black hover:bg-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.3)]' 
                            : 'bg-white text-black hover:bg-zinc-200'
                        }`}
                    >
                        立即升級
                    </button>
                </div>
            ))}
        </div>
    );
}
