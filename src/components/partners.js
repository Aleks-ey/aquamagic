import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import "font-awesome/css/font-awesome.min.css";
import Image from "next/image";
import PartnerModal from "./partnerModal";

function Partners() {
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);

  // Fallback logos
  const logos = {
    "Swim 'N Things": "/images/swimnthingsLogo-removebg2.png",
    "Kids Time": "/images/kidstimeLogo_nbg.png",
  };

  // Fallback image galleries
  const galleries = {
    "Kids Time": [
      "/images/kidstime_en.png",
      "/images/kidstime_ru.png",
      "/images/kidstime_qr.png",
    ],
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  async function fetchPartners() {
    const { data, error } = await supabase.from("partners").select("*");
    if (error) {
      console.error("Error fetching partners:", error);
      return;
    }
    setPartners(data || []);
  }

  function getPartnerLogo(partner) {
    if (partner.logoUrl) return partner.logoUrl;
    if (logos[partner.name]) return logos[partner.name];
    return "/images/default-partner-logo.png";
  }

  function getPartnerGallery(partner) {
    // use db value first, fallback to hardcoded galleries
    if (
      Array.isArray(partner.image_gallery) &&
      partner.image_gallery.length > 0
    )
      return partner.image_gallery;
    if (galleries[partner.name]) return galleries[partner.name];
    return [];
  }

  function handleCardClick(partner) {
    // inject fallback gallery if not defined
    if (
      !Array.isArray(partner.image_gallery) ||
      partner.image_gallery.length === 0
    ) {
      partner.image_gallery = getPartnerGallery(partner);
    }
    setSelectedPartner(partner);
  }

  function closeModal() {
    setSelectedPartner(null);
  }

  return (
    <div className="py-16">
      <h1 className="text-4xl lg:text-5xl text-right font-serif">Partners</h1>

      <div className="flex flex-wrap-reverse md:flex-wrap justify-center md:justify-end gap-6 bg-blue-100 px-4 py-6 rounded-lg">
        {partners.length < 3 && (
          <div className="partner_card w-64 bg-white shadow-md rounded-md p-4 cursor-pointer content-center">
            <a href="/contact" className="flex flex-col items-center">
              <h2 className="text-2xl text-center font-serif mt-2">
                Contact Us
              </h2>
              <p className="text-center font-serif italic">
                if you would like to be a partner
              </p>
            </a>
          </div>
        )}

        {partners.map((partner) => (
          <div
            key={partner.id}
            className="partner_card w-64 h-80 bg-white shadow-md rounded-md p-4 cursor-pointer flex flex-col justify-between transform hover:scale-105 hover:shadow-lg transition-transform duration-300"
            onClick={() => handleCardClick(partner)}
          >
            {/* Top: image area (takes up ~75%) */}
            <div className="flex items-center justify-center h-3/4">
              <Image
                src={getPartnerLogo(partner)}
                alt={partner.name}
                width={160}
                height={160}
                className="object-contain max-h-full rounded-md"
              />
            </div>

            {/* Bottom: name/title area (takes up ~25%) */}
            <div className="flex flex-col items-center justify-center h-1/4">
              <h2 className="text-2xl text-center font-serif mt-1">
                {partner.name}
              </h2>
              <p className="text-center font-serif italic text-gray-600">
                {partner.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {selectedPartner && (
        <PartnerModal
          partner={selectedPartner}
          onClose={closeModal}
          getPartnerLogo={getPartnerLogo}
        />
      )}
    </div>
  );
}

export default Partners;
