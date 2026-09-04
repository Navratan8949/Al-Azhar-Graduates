"use client"
import { QRCodeSVG } from "qrcode.react"
import { useSelector } from "react-redux"

export function IdCard({ member, user, verificationUrl }) {
  const siteContent = useSelector(state => state.siteContent.data);
  let signatureUrl = null;
  if (siteContent?.site_logo?.content) {
    try {
      const parsed = JSON.parse(siteContent.site_logo.content);
      signatureUrl = parsed.signature;
    } catch (e) {}
  }

  if (!member || !user) return null

  return (
    <div className="flex justify-center w-full group perspective-1000">
      <div 
        id="id-card" 
        className="relative w-full max-w-[340px] overflow-hidden rounded-[16px] bg-[#f8f9fa] shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-1 ring-border/20 transition-transform duration-500 hover:rotate-y-2 hover:rotate-x-2 preserve-3d"
        style={{ aspectRatio: "2.125 / 3.375" }} // Standard CR80 ID Card Ratio
      >
        {/* Background Patterns */}
        <div className="absolute inset-0 z-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#002114 1px, transparent 1px)', backgroundSize: '12px 12px' }}></div>
        <div className="absolute inset-0 z-0 opacity-20 bg-gradient-to-br from-emerald-100/50 via-transparent to-[#d4af37]/10"></div>
        <div className="absolute -right-24 -top-24 size-64 rounded-full bg-[#d4af37]/10 blur-[60px] z-0 pointer-events-none"></div>

        <div className="relative z-10 flex h-full flex-col">
          
          {/* Card Header (Premium Dark Green with Gold Accent) */}
          <div className="bg-[#002114] p-4 text-center text-white shadow-md relative overflow-hidden flex flex-col items-center justify-center">
            {/* Subtle overlay texture */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:10px_10px]"></div>
            
            <div className="relative z-10 w-full">
              <h2 className="font-serif text-[14px] font-extrabold tracking-widest leading-tight text-[#f3e5ab] drop-shadow-sm uppercase">WORLD ASSOCIATION FOR</h2>
              <h2 className="font-serif text-[12px] font-bold tracking-wider leading-tight text-white mb-2">AL-AZHAR GRADUATES</h2>
              <div className="mx-auto w-fit rounded bg-gradient-to-r from-[#b45309] via-[#d4af37] to-[#b45309] px-2 py-0.5 shadow-sm">
                <p className="text-[7.5px] font-black uppercase tracking-[0.2em] text-[#002114]">Govt. Regd. NGO</p>
              </div>
            </div>
          </div>
          
          {/* Gold Strip */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#b45309] via-[#d4af37] to-[#b45309] shadow-sm"></div>

          {/* Card Body */}
          <div className="flex-1 p-5 flex flex-col items-center relative">
            
            {/* Watermark Logo */}
            <div className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 z-0 opacity-[0.03] w-[80%] flex justify-center items-center pointer-events-none select-none">
              <div className="w-40 h-40 bg-[#002114] rounded-full blur-[10px]"></div>
            </div>
            
            {/* Profile Image with Gold Frame */}
            <div className="relative mb-3 shrink-0 z-10 mt-2">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#b45309] via-[#d4af37] to-[#b45309] shadow-md"></div>
              <div className="relative size-[110px] overflow-hidden rounded-full border-4 border-white bg-white shadow-inner">
                {member.profileImage?.url || user.profileImage?.url ? (
                  <img src={member.profileImage?.url || user.profileImage?.url} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-serif text-5xl font-bold text-[#002114]/30 bg-slate-100">
                    {user.fullName?.[0] || "?"}
                  </div>
                )}
              </div>
            </div>

            {/* Member Identity Info */}
            <div className="w-full text-center space-y-2 z-10 relative">
              <div className="mb-3">
                <h3 className="font-serif text-[22px] font-black text-[#002114] leading-none uppercase tracking-tight">{user.fullName}</h3>
                <div className="flex items-center justify-center mt-1.5 gap-1.5">
                  <div className="h-px w-6 bg-[#d4af37]"></div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#b45309]">{member.membershipType || "Official"} Member</p>
                  <div className="h-px w-6 bg-[#d4af37]"></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-left bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-border/40 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <div>
                  <p className="text-[6.5px] font-black uppercase tracking-[0.15em] text-slate-400 mb-0.5">Member ID</p>
                  <p className="text-[12px] font-bold font-mono text-[#002114] leading-none">{member.memberId}</p>
                </div>
                <div>
                  <p className="text-[6.5px] font-black uppercase tracking-[0.15em] text-slate-400 mb-0.5">Blood Group</p>
                  <p className="text-[12px] font-black text-[#b45309] leading-none">{member.bloodGroup || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[6.5px] font-black uppercase tracking-[0.15em] text-slate-400 mb-0.5">Valid From</p>
                  <p className="text-[11px] font-bold text-[#002114] leading-none">{new Date(member.joiningDate || Date.now()).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[6.5px] font-black uppercase tracking-[0.15em] text-slate-400 mb-0.5">Mobile</p>
                  <p className="text-[11px] font-bold text-[#002114] leading-none">{user.mobile || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="mt-auto w-full pt-4 flex items-end justify-between z-10">
              {/* Dynamic QR Code */}
              <div className="size-[55px] shrink-0 rounded-lg bg-white p-1 shadow-md border border-[#d4af37]/30 ring-2 ring-white">
                <QRCodeSVG value={verificationUrl} size={100} className="h-full w-full" fgColor="#002114" />
              </div>
              
              <div className="text-right">
                {/* Signature */}
                {signatureUrl ? (
                  <img src={signatureUrl} alt="Signature" className="h-10 ml-auto object-contain -mb-1" />
                ) : (
                  <div className="font-[Signature] text-2xl text-[#002114]/90 leading-none -mb-1.5 transform -rotate-3">Authorized</div>
                )}
                <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#002114]/30 to-[#002114]/30 ml-auto my-1"></div>
                <p className="text-[7px] font-bold uppercase tracking-wider text-slate-500">Issuing Authority</p>
              </div>
            </div>
            
          </div>
          
          {/* Bottom Strip */}
          <div className="h-2.5 w-full bg-[#002114]"></div>
        </div>
        
        {/* Glossy Overlay Reflection */}
        <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-tr from-white/0 via-white/50 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ mixBlendMode: 'overlay' }}></div>
      </div>
    </div>
  )
}
