import { useNavigate } from "react-router-dom";
import { 
  FiMail, FiPhone, FiMessageSquare, FiInfo,
  FiChevronRight, FiShield, FiCreditCard, FiUser, FiZap 
} from "react-icons/fi";
import { BsChatRightDots } from "react-icons/bs";

export default function SupportPage() {
  const navigate = useNavigate();

  const quickQuestions = [
    { 
      id: "deposit", 
      label: "Deposit Issue", 
      icon: <FiCreditCard className="text-primary" />, 
      desc: "Instant help with your deposits",
      to: "/deposit" 
    },
    { 
      id: "withdrawal", 
      label: "Withdrawal Help", 
      icon: <FiZap className="text-orange-400" />, 
      desc: "Track or request your winnings",
      to: "/withdraw" 
    },
    { 
      id: "account", 
      label: "Account Problem", 
      icon: <FiUser className="text-blue-400" />, 
      desc: "Login, verification and security",
      to: "/profile" 
    },
    { 
      id: "how-to-play", 
      label: "How to Play", 
      icon: <FiInfo className="text-green-400" />, 
      desc: "Learn our games and rules",
      to: "/casino" 
    },
  ];

  const contactMethods = [
    {
      id: "chat",
      label: "Live Chat",
      icon: <FiMessageSquare size={20} />,
      desc: "Speak with our team instantly",
      color: "bg-primary text-black",
      action: () => { 
        if (typeof window.openSupportChat === 'function') {
          window.openSupportChat();
        }
      }
    },
    {
      id: "email",
      label: "Email Support",
      icon: <FiMail size={20} />,
      desc: "support@shilingibet.com",
      color: "bg-white/5 text-white hover:bg-white/10",
      action: () => { window.location.href = "mailto:support@shilingibet.com"; }
    },
    {
      id: "phone",
      label: "Phone Support",
      icon: <FiPhone size={20} />,
      desc: "0800 724 835 (Toll-Free)",
      color: "bg-white/5 text-white hover:bg-white/10",
      action: () => { window.location.href = "tel:0800724835"; }
    },
  ];

  return (
    <div className="flex flex-col py-6 px-2 md:px-0 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="text-center md:text-left space-y-2">
        <h1 className="text-3xl font-black text-white tracking-tight">Support Center</h1>
        <p className="text-gray-400 text-lg">We're here to help you 24/7 with any questions.</p>
      </div>

      {/* Main Grid: Info + Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Quick Questions */}
        <div className="lg:col-span-2 space-y-4">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest px-1">Quick Solutions</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickQuestions.map((q) => (
              <button 
                key={q.id}
                onClick={() => navigate(q.to)}
                className="flex items-center gap-4 p-5 bg-surface border border-white/5 rounded-2xl hover:border-primary/30 transition-all group text-left shadow-xl"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-xl group-hover:bg-primary/10 transition-colors text-2xl">
                  {q.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white group-hover:text-primary transition-colors">{q.label}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{q.desc}</p>
                </div>
                <FiChevronRight className="text-gray-600 group-hover:text-primary transition-all group-hover:translate-x-1" />
              </button>
            ))}
          </div>

          <div className="mt-8 p-6 bg-surface border border-white/5 rounded-2xl flex flex-col md:flex-row items-center gap-6 shadow-xl">
            <div className="w-16 h-16 flex items-center justify-center bg-primary/10 rounded-full text-primary text-3xl">
              <FiShield />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-bold text-white">Responsible Gaming</h3>
              <p className="text-sm text-gray-400 mt-1 max-w-md">Our commitment to your safety. Access tools to manage your play and find professional support if you need it.</p>
            </div>
            <button className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold text-sm rounded-xl transition-colors whitespace-nowrap">
              Learn More
            </button>
          </div>
        </div>

        {/* Right Column: Contact Methods */}
        <div className="space-y-4">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest px-1">Direct Contact</p>
          <div className="flex flex-col gap-4">
            {contactMethods.map((c) => (
              <button
                key={c.id}
                onClick={c.action}
                className={`flex items-start gap-4 p-5 rounded-2xl transition-all shadow-xl text-left border border-white/5 ${c.color}`}
              >
                <div className="mt-1">{c.icon}</div>
                <div>
                  <h3 className="font-bold text-base leading-none">{c.label}</h3>
                  <p className={`text-xs mt-1.5 opacity-70`}>{c.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Social Links / Welcome Box */}
          <div className="mt-6 p-6 bg-gradient-to-br from-surface to-[#102016] border border-white/5 rounded-2xl text-center space-y-4 shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-700"></div>
            <BsChatRightDots className="mx-auto text-4xl text-primary opacity-80" />
            <h3 className="text-xl font-black text-white">Welcome!</h3>
            <p className="text-sm text-gray-400">Our agents typically respond in under 5 minutes.</p>
            <button 
              onClick={() => {
                if (typeof window.openSupportChat === 'function') {
                  window.openSupportChat();
                }
              }}
              className="w-full py-4 bg-primary text-black font-black text-sm uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(24acc15,0.25)] hover:scale-[1.02] transition-all"
            >
              Start Conversation
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
