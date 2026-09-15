import Footer from "../../components/Footer";
import PromotionsCard from "./PromotionsCard";
import GoBack from "../../components/GoBack";

function Promotions() {
  return (
    <div className="min-h-screen bg-background  overflow-y-scroll no-scrollbar ">
      <GoBack />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 p-3 mb-16 max-w-6xl mx-auto">
        <PromotionsCard
          id="registration"
          title="Registration Bonus"
          description="Register and instantly get Ksh.10 Instant Stake to start playing."
          src="/5.jpg"
        />
        <PromotionsCard
          id="refer"
          title="Refer & Earn"
          description="Invite friends and earn weekly rewards every time they deposit & play."
          src="/3.jpg"
        />
        <PromotionsCard
          id="daily-cashback"
          title="Daily Cashback"
          description="Get guaranteed cashback daily on your bets. No hidden conditions."
          src="/2.jpg"
        />
        <PromotionsCard
          id="aviator-daily"
          title="Aviator Daily Cashback"
          description="Daily Freebets & Free Rains worth Ksh.5M available every day."
          src="/4.jpg"
        />
        <PromotionsCard
          id="aviator-challenges"
          title="Aviator Challenges"
          description="Join Missions, Races, and Tournaments to win Freebets, Cash & Merch."
          src="/1.jpg"
        />
      </div>{" "}
      <Footer />
    </div>
  );
}

export default Promotions;
