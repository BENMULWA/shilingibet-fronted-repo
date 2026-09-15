import { FiSearch } from "react-icons/fi";
import { useState } from "react";
import HelpItem from "./HelpItem";

const faqs = [
  {
    label: "How do I deposit funds?",
    answer:
      "To deposit funds, go to your Profile and tap 'Deposit'. Enter an amount between KES 10 and KES 140,000 or select a preset amount. Complete the M-Pesa payment and your funds will appear instantly in your wallet. Note: A 5% tax is deducted from all deposits.",
    keywords: ["mpesa", "money", "add funds", "top up", "payment", "pay", "fund", "wallet", "balance"],
  },
  {
    label: "How do I withdraw my winnings?",
    answer:
      "Go to Profile → Withdraw. Your M-Pesa number is pre-filled. Enter the amount you wish to withdraw (KES 100 - KES 70,000). A 5% tax will be deducted, and the remaining amount is sent instantly to your M-Pesa account.",
    keywords: ["cash out", "cashout", "payout", "money", "mpesa", "receive", "get money", "winnings", "earnings"],
  },
  {
    label: "How does the Refer & Earn program work?",
    answer:
      "Share your unique referral link from your Profile with friends. When they register and deposit, you earn 5% commission on every deposit they make. Your earnings appear in your 'Referral Bonus' wallet and can be redeemed to your main wallet (minimum KES 10 balance required). Referral bonuses can only be used on Aviator.",
    keywords: ["invite", "friend", "share", "link", "commission", "bonus", "earn", "referral code", "promo"],
  },
  {
    label: "What games are available on ShilingiBet?",
    answer:
      "We offer a variety of games including: Aviator (crash game by Spribe), Crash games from multiple providers (Elbet, Turbo, Imoon, KA Gaming), Slots, Roulette, and Casino games (cards, dice, scratch cards). Browse all games from the homepage or use the search feature.",
    keywords: ["aviator", "crash", "slots", "roulette", "casino", "play", "bet", "spribe", "gaming"],
  },
  {
    label: "How do bonuses and cashback work?",
    answer:
      "ShilingiBet offers Daily Cashback on your bets, Aviator Daily Cashback with free bets worth up to KES 5M daily, and Aviator Challenges (missions, races, tournaments) to win freebets, cash, and merchandise. To redeem bonuses, go to Profile → Redeem Bonus. Your account must be active within 30 days.",
    keywords: ["free", "freebet", "reward", "promo", "promotion", "daily", "challenge", "mission", "redeem"],
  },
  {
    label: "Why was tax deducted from my transaction?",
    answer:
      "A 5% withholding tax is applied to all deposits and withdrawals as per Kenyan tax regulations. For example, if you deposit KES 1,000, KES 50 is deducted as tax, leaving KES 950 in your wallet. This is displayed before you confirm any transaction.",
    keywords: ["5%", "deduction", "less money", "fee", "charge", "withholding", "kra", "government"],
  },
  {
    label: "How can I view my transaction history?",
    answer:
      "Go to Profile → Transaction Records. You can filter by date (Today, Week, Month, or custom range) and by type (All, Deposits, or Withdrawals). Each transaction shows the amount, tax, status, reference code, and timestamp. You'll also see a summary of total transactions and tax paid.",
    keywords: ["records", "history", "statement", "past", "previous", "filter", "status", "pending", "failed"],
  },
  {
    label: "What is the Responsible Gaming policy?",
    answer:
      "ShilingiBet is committed to responsible gaming. Only users 18+ are allowed. You can set deposit limits, request self-exclusion via support, and access responsible gaming tools from your profile. If you're experiencing gambling problems, contact support@shilingibet.com or reach out to Gamblers Anonymous Kenya.",
    keywords: ["limit", "addiction", "problem", "help", "support", "age", "18", "block", "self exclusion", "stop"],
  },
];

export default function HelpScreen() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFaqs = faqs.filter((faq) => {
    const search = searchTerm.toLowerCase().trim();
    if (!search) return true;

    // Search in label
    if (faq.label.toLowerCase().includes(search)) return true;

    // Search in answer
    if (faq.answer.toLowerCase().includes(search)) return true;

    // Search in keywords
    if (faq.keywords.some((keyword) => keyword.toLowerCase().includes(search))) return true;

    // Check if any word in search matches keywords
    const searchWords = search.split(" ");
    if (searchWords.some((word) =>
      word.length > 2 && faq.keywords.some((keyword) => keyword.includes(word))
    )) return true;

    return false;
  });

  return (
    <div className="help-screen">
      <h2 className="help-title">Help Center</h2>

      <div className="help-search">
        <div className="help-search-icon">
          <FiSearch size={18} />
        </div>
        <input
          type="text"
          placeholder="Search for help..."
          className="help-search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="help-faq">
        <p className="help-faq-title">
          {searchTerm ? `Results for "${searchTerm}"` : "Frequently Asked Questions"}
        </p>

        <div className="help-faq-list">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <HelpItem key={index} label={faq.label} answer={faq.answer} />
            ))
          ) : (
            <p className="help-no-results">
              No results found for "{searchTerm}". Try different keywords like "deposit", "withdraw", "bonus", or "games".
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
