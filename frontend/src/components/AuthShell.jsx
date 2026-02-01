import { Building2, ShieldCheck, Sparkles, Home, Hammer, HardHat } from "lucide-react";

export default function AuthShell({
                                      title = "Welcome",
                                      subtitle = "",
                                      children,
                                      bottomText,
                                  }) {
    return (
        <div className="min-h-screen w-full bg-[#f6efe6] relative overflow-hidden">
            {/* MAP BACKGROUND IMAGE */}
            <div className="absolute inset-0">
                <img
                    src="/src/assets/map-bg.jpg"
                    alt="map background"
                    className="h-full w-full object-cover opacity-[0.5]"
                />
                {/* cream tint */}
                <div className="absolute inset-0 bg-[#f6efe6]/80" />
            </div>

            {/* Brown themed overlay icons */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-[8%] top-[18%] opacity-25 rotate-[-10deg]">
                    <Home className="h-20 w-20 text-[#6F4E37]" />
                </div>
                <div className="absolute left-[22%] bottom-[20%] opacity-20 rotate-[12deg]">
                    <Hammer className="h-20 w-20 text-[#2B1B12]" />
                </div>
                <div className="absolute right-[10%] top-[12%] opacity-20 rotate-[8deg]">
                    <HardHat className="h-20 w-20 text-[#6F4E37]" />
                </div>
                <div className="absolute right-[22%] bottom-[18%] opacity-20 rotate-[-8deg]">
                    <Home className="h-16 w-16 text-[#2B1B12]" />
                </div>
            </div>

            <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">
                <div className="relative grid w-full overflow-hidden rounded-3xl border border-[#2B1B12]/10 bg-white shadow-2xl lg:grid-cols-2">
                    {/* LEFT PANEL */}
                    <div className="relative hidden lg:flex flex-col justify-between p-10 bg-[#2B1B12]">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
                                <Building2 className="h-5 w-5 text-[#d6b38c]" />
                                <span className="text-lg font-semibold tracking-wide text-[#fff7ee]">
                  resiDAO
                </span>
                            </div>

                            <h2 className="mt-8 text-4xl font-bold leading-tight text-[#fff7ee]">
                                Decentralized Real Estate
                                <span className="block text-[#d6b38c]">with governance.</span>
                            </h2>

                            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
                                Secure authentication for residents & companies. Manage proposals,
                                votes and property governance in one place.
                            </p>
                        </div>

                        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
                            <div className="flex items-start gap-4">
                                <div className="rounded-2xl bg-[#d6b38c]/15 p-3 border border-[#d6b38c]/20">
                                    <ShieldCheck className="h-6 w-6 text-[#d6b38c]" />
                                </div>
                                <div>
                                    <p className="text-base font-semibold text-[#fff7ee]">Premium Security</p>
                                    <p className="mt-1 text-sm text-white/70">
                                        Wallet-linked identity, secure sessions, and protected routes.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 flex items-start gap-4">
                                <div className="rounded-2xl bg-[#d6b38c]/15 p-3 border border-[#d6b38c]/20">
                                    <Sparkles className="h-6 w-6 text-[#d6b38c]" />
                                </div>
                                <div>
                                    <p className="text-base font-semibold text-[#fff7ee]">Smooth Experience</p>
                                    <p className="mt-1 text-sm text-white/70">
                                        Clean UI, fast interactions, and responsive layout.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <p className="text-xs text-white/40">
                            © {new Date().getFullYear()} resiDAO — All rights reserved.
                        </p>

                        {/* WIGGLY DIVIDER */}
                        <svg
                            className="pointer-events-none absolute right-0 top-0 h-full w-24"
                            viewBox="0 0 80 1000"
                            preserveAspectRatio="none"
                        >
                            <path
                                d="
                  M80,0
                  C52,60 70,110 40,170
                  C12,230 70,300 38,370
                  C6,440 72,520 40,600
                  C10,680 72,760 38,840
                  C8,920 52,960 80,1000
                  L80,1000
                  L80,0
                  Z
                "
                                fill="#f4ece2"
                            />
                        </svg>
                    </div>

                    {/* RIGHT PANEL */}
                    <div className="flex items-center justify-center p-6 sm:p-10 bg-[#f4ece2]">
                        <div className="w-full max-w-md">
                            <h1 className="text-3xl font-bold text-[#2B1B12]">{title}</h1>
                            {subtitle ? (
                                <p className="mt-2 text-sm text-[#2B1B12]/70">{subtitle}</p>
                            ) : null}

                            <div className="mt-8">{children}</div>

                            {bottomText ? (
                                <div className="mt-6 text-center text-sm text-[#2B1B12]/70">
                                    {bottomText}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
