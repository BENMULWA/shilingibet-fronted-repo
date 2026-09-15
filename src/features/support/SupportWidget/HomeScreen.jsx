import Header from "./Header";
import HelpItem from "./HelpItem";
import MessageCard from "./MessageCard";

const popularTopics = [
  {
    label: "How do I deposit funds?",
    answer:
      "To deposit funds, go to your Profile and tap 'Deposit'. Enter an amount between KES 10 and KES 140,000 or select a preset amount. Complete the M-Pesa payment and your funds will appear instantly in your wallet. Note: A 5% tax is deducted from all deposits.",
  },
  {
    label: "How do I withdraw my winnings?",
    answer:
      "Go to Profile → Withdraw. Your M-Pesa number is pre-filled. Enter the amount you wish to withdraw (KES 100 - KES 70,000). A 5% tax will be deducted, and the remaining amount is sent instantly to your M-Pesa account.",
  },
  {
    label: "How does the Refer & Earn program work?",
    answer:
      "Share your unique referral link from your Profile with friends. When they register and deposit, you earn 5% commission on every deposit they make. Your earnings appear in your 'Referral Bonus' wallet and can be redeemed to your main wallet.",
  },
  {
    label: "What games are available?",
    answer:
      "We offer Aviator (crash game by Spribe), Crash games from multiple providers, Slots, Roulette, and Casino games. Browse all games from the homepage or use the search feature.",
  },
];

export default function HomeScreen({ onStartChat }) {
  return (
    <div className="home-screen">
      <Header />

      <MessageCard onStartChat={onStartChat} />

      <div className="home-topics">
        <p className="home-topics-title">Popular topics</p>
        <div className="home-topics-list">
          {popularTopics.map((topic, index) => (
            <HelpItem key={index} label={topic.label} answer={topic.answer} />
          ))}
        </div>
      </div>
    </div>
  );
}
