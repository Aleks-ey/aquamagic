import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import "font-awesome/css/font-awesome.min.css";
import Image from "next/image";

function Partners() {
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);

  // Hard-coded dictionary of fallback logos (by partner name)
  // For any partner that doesn't have a 'logoUrl' in the database,
  // we look here to see if we have a known local path.
  const logos = {
    "Swim 'N Things": "/images/swimnthingsLogo-removebg2.png",
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  async function fetchPartners() {
    // We fetch everything from the 'partners' table:
    // columns: id, logoUrl, name, title, description, link, news (json)
    const { data, error } = await supabase.from("partners").select("*");

    if (error) {
      console.error("Error fetching partners:", error);
      return;
    }

    if (data && data.length > 0) {
      setPartners(data);
    } else {
      setPartners([]);
    }
  }

  function getPartnerLogo(partner) {
    // If partner.logoUrl is truthy, use that
    if (partner.logoUrl) {
      return partner.logoUrl;
    }
    // Otherwise, if we have a fallback in 'logos'
    if (logos[partner.name]) {
      return logos[partner.name];
    }
    // Otherwise, default or placeholder
    return "/images/default-partner-logo.png";
  }

  function handleCardClick(partner) {
    setSelectedPartner(partner);
  }

  function closeModal() {
    setSelectedPartner(null);
  }

  // Filter relevant news items based on date range
  function getActiveNewsItems(newsJson) {
    if (!Array.isArray(newsJson)) return [];

    const today = new Date();
    return newsJson.filter((item) => {
      // parse the start_date & end_date from item
      // They might be strings in the form YYYY-MM-DD
      if (!item.start_date || !item.end_date) return false;

      const start = new Date(item.start_date);
      const end = new Date(item.end_date);
      return start <= today && today <= end;
    });
  }

  return (
    <div className="py-16">
      <h1 className="text-4xl lg:text-5xl text-right font-serif">Partners</h1>

      {/* Cards */}
      <div className="flex flex-wrap-reverse md:flex-wrap justify-center md:justify-end gap-6 bg-blue-100 px-4 py-6 rounded-lg">
        {/* If less than 3 partners, contact us card */}
        {partners.length < 3 && (
          <div className="partner_card w-64 bg-white shadow-md rounded-md p-4 cursor-pointer">
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
            className="partner_card w-64 bg-white shadow-md rounded-md p-4 cursor-pointer"
            onClick={() => handleCardClick(partner)}
          >
            <Image
              src={getPartnerLogo(partner)}
              alt={partner.name}
              width={200}
              height={200}
              className="rounded-md mx-auto"
            />
            <h2 className="text-2xl text-center font-serif mt-2">
              {partner.name}
            </h2>
            <p className="text-center font-serif italic">{partner.title}</p>
          </div>
        ))}
      </div>

      {/* Modal (Popup) */}
      {selectedPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2">
          {/* Modal content container */}
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm md:max-w-lg relative max-h-[90vh] overflow-y-auto p-4">
            {/* Close button */}
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={closeModal}
            >
              <i className="fa fa-times fa-lg"></i>
            </button>

            <div className="p-4">
              {/* Partner info */}
              <div className="flex flex-col items-center mb-4">
                <Image
                  src={getPartnerLogo(selectedPartner)}
                  alt={selectedPartner.name}
                  width={150}
                  height={150}
                  className="rounded-md"
                />
                <h2 className="text-2xl font-serif mt-2">
                  {selectedPartner.name}
                </h2>
                {selectedPartner.title && (
                  <p className="text-lg italic">{selectedPartner.title}</p>
                )}
              </div>

              <div className="mb-4">
                {/* Description */}
                {selectedPartner.description && (
                  <p className="text-gray-700">{selectedPartner.description}</p>
                )}

                {/* Link */}
                {selectedPartner.link && (
                  <p className="mt-2">
                    Visit:{" "}
                    <a
                      href={selectedPartner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {selectedPartner.link}
                    </a>
                  </p>
                )}
              </div>

              {/* Partner News */}
              <div className="border-t pt-2">
                <h3 className="text-xl font-semibold">Partner News</h3>
                {Array.isArray(selectedPartner.news) &&
                getActiveNewsItems(selectedPartner.news).length > 0 ? (
                  <>
                    {getActiveNewsItems(selectedPartner.news).map(
                      (newsItem, idx) => (
                        <div key={idx} className="mt-2 p-2 bg-gray-100 rounded">
                          <h4 className="text-lg font-bold">
                            {newsItem.title}
                          </h4>
                          {newsItem.imageUrl && (
                            <div className="my-2 place-items-center">
                              <Image
                                src={newsItem.imageUrl}
                                alt={newsItem.title}
                                width={200}
                                height={200}
                                className="rounded"
                              />
                            </div>
                          )}
                          <p className="text-left">{newsItem.description}</p>
                          {/* Link if present */}
                          {newsItem.link && (
                            <a
                              href={newsItem.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              More Info
                            </a>
                          )}
                        </div>
                      )
                    )}
                  </>
                ) : (
                  <p className="mt-2 text-gray-500">
                    No current news to display.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Partners;
