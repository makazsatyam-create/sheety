import React from 'react'
import { IoLogoWhatsapp } from "react-icons/io";

function FooterInfo() {
  return (
    <div className="bg-[#008c95] flex flex-col items-center justify-center p-4 mt-10 text-center">
      
      <span className="max-w-[320px] md:max-w-[600px] text-[16px] md:text-[18px] font-bold leading-snug text-black">
        Need help? Our 24/7 support team is here for you anytime!
      </span>

      <IoLogoWhatsapp className="mt-2 text-[22px] text-black" />
    </div>
  )
}

export default FooterInfo
