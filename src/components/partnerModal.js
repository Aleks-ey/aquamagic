// components/partnerModal.js
import React, { useState } from "react";
import Image from "next/image";
import Carousel from "./carousel";

export default function PartnerModal({ partner, onClose, getPartnerLogo }) {
  if (!partner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm md:max-w-lg relative max-h-[90vh] overflow-y-auto p-4">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          <i className="fa fa-times fa-lg"></i>
        </button>

        {partner.display_style === "carousel" &&
        Array.isArray(partner.image_gallery) ? (
          <Carousel images={partner.image_gallery} />
        ) : (
          <div className="p-4">
            {/* Partner Info */}
            <div className="flex flex-col items-center mb-4">
              <Image
                src={getPartnerLogo(partner)}
                alt={partner.name}
                width={150}
                height={150}
                className="rounded-md"
              />
              <h2 className="text-2xl font-serif mt-2">{partner.name}</h2>
              {partner.title && (
                <p className="text-lg italic">{partner.title}</p>
              )}
            </div>

            <div className="mb-4">
              {partner.description && (
                <p className="text-gray-700">{partner.description}</p>
              )}

              {partner.link && (
                <p className="mt-2">
                  Visit:{" "}
                  <a
                    href={partner.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {partner.link}
                  </a>
                </p>
              )}
            </div>

            {/* Partner News */}
            {Array.isArray(partner.news) && partner.news.length > 0 && (
              <div className="border-t pt-2">
                <h3 className="text-xl font-semibold">Partner News</h3>
                {partner.news.map((newsItem, idx) => (
                  <div key={idx} className="mt-2 p-2 bg-gray-100 rounded">
                    <h4 className="text-lg font-bold">{newsItem.title}</h4>
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
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
