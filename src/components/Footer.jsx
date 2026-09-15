const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialIcons = [
    {
      src: "https://img.icons8.com/color/48/whatsapp--v1.png",
      alt: "whatsapp",
      link: "https://wa.me/254103102336",
    },
    {
      src: "https://img.icons8.com/color/48/facebook-new.png",
      alt: "facebook",
      link: "https://www.facebook.com/share/19G9hNV6jD/?mibextid=wwXIfr",
    },
    {
      src: "https://img.icons8.com/color/48/instagram-new--v1.png",
      alt: "instagram",
      link: "https://www.instagram.com/shilingibet?igsh=MmRkZzI1MTQ0bmo1&utm_source=qr",
    },
    {
      src: "https://img.icons8.com/color/48/twitterx--v1.png",
      alt: "twitter-x",
      link: "https://x.com/shilingibet?s=11",
    },
    {
      src: "https://img.icons8.com/color/48/tiktok--v1.png",
      alt: "tiktok",
      link: "https://www.tiktok.com/@shilingibet",
    },
    {
      src: "https://img.icons8.com/color/48/youtube-play.png",
      alt: "youtube",
      link: "https://youtube.com/@shilingibet",
    },
  ];

  const handleLinkClick = (link) => {
    if (link.startsWith("mailto:")) {
      const email = link.replace("mailto:", "");
      const mailWindow = window.open(
        `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`,
        "_blank"
      );
      if (!mailWindow) window.location.href = link;
    } else if (link.startsWith("tel:") || link.startsWith("wa.me")) {
      window.location.href = link;
    } else {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <footer className="mt-10 px-0 py-6 text-[#9cae9f] md:px-6">
      <div className="mx-auto w-full overflow-hidden rounded-none border-y border-white/10 bg-surface/75 shadow-2xl md:rounded-2xl md:border">
        <div className="border-b border-white/10 bg-[radial-gradient(circle_at_20%_0%,rgba(250,204,21,0.14),transparent_28rem),linear-gradient(135deg,rgba(21,128,61,0.18),rgba(7,17,11,0.72))] px-5 py-6 md:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <img src="/favicons.svg" alt="Logo" className="h-12 w-12" />
              <img src="/shilingibet.png" alt="shilingibet" className="h-10" />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs md:min-w-[360px]">
              <div className="rounded-xl border border-white/10 bg-black/15 px-3 py-2">
                <p className="font-bold text-white">18+</p>
                <p className="text-[#9cae9f]">Adults only</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/15 px-3 py-2">
                <p className="font-bold text-primary">BCLB</p>
                <p className="text-[#9cae9f]">Licensed</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/15 px-3 py-2">
                <p className="font-bold text-white">KES</p>
                <p className="text-[#9cae9f]">Kenya</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 px-5 py-7 md:grid-cols-[1fr_1fr_1.4fr] md:px-8">
          <div className="space-y-5">
            <div>
              <h3 className="mb-2 text-sm font-bold text-white">ShilingiBet</h3>
              <p className="max-w-sm text-sm leading-relaxed">
                Sports betting, casino games, fast payments, and responsible play for Kenyan players.
              </p>
            </div>

            <a
              href="/app/shilingibet.apk"
              download
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-black text-black transition hover:brightness-110"
            >
              Download App
            </a>
          </div>

          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="mb-3 text-sm font-bold text-white">Legal</h3>
              <div className="flex flex-col gap-2">
                <a href="#" className="transition-colors hover:text-primary">Terms</a>
                <a href="#" className="transition-colors hover:text-primary">Responsible gaming</a>
                <a href="#" className="transition-colors hover:text-primary">Privacy policy</a>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-bold text-white">Contact</h3>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleLinkClick("mailto:info@shilingibet.com")}
                  className="text-left transition-colors hover:text-primary"
                >
                  info@shilingibet.com
                </button>
                <button
                  type="button"
                  onClick={() => handleLinkClick("tel:+254103102336")}
                  className="text-left transition-colors hover:text-primary"
                >
                  +254 103 102 336
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-[#07110b]/80 p-4">
              <h3 className="mb-2 text-sm font-bold text-white">Responsible Gaming</h3>
              <p className="text-xs leading-relaxed">
                Real-money gambling is for adults only. Play responsibly and only bet with what you can afford.
                For support, call <span className="font-semibold text-white">0800 724835</span>.
              </p>
            </div>

            {/*
            <div className="rounded-xl border border-white/10 bg-[#07110b]/80 p-4">
              <h3 className="mb-2 text-sm font-bold text-white">License</h3>
              <p className="text-xs leading-relaxed">
                Glustar Trading Co. Limited operates ShilingiBet under BCLB license{" "}
                <span className="font-semibold text-primary">BK-0001296</span>.
              </p>
            </div>
            */}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="flex gap-3">
            {socialIcons.map((icon) => (
              <button
                key={icon.alt}
                type="button"
                onClick={() => handleLinkClick(icon.link)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:border-primary/50 hover:bg-primary/10"
                aria-label={icon.alt}
              >
                <img
                  width="22"
                  height="22"
                  src={icon.src}
                  alt={icon.alt}
                />
              </button>
            ))}
          </div>

          <div className="text-xs md:text-right">
            <p>© {currentYear} ShilingiBet. All rights reserved.</p>
            <p className="mt-1 text-[#6f7f73]">Version v1.5.21</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
