"use client";
import React from "react";
import { motion } from "framer-motion";

const cardData = [
  {
    id: 1,
    title: "Kiwi Ears Astral",
    text: "IEM hybrid สายพลังเสียงสะอาด โปร่งใส เวทีเสียงกว้าง เบสแน่นกลางชัด แหลมละเอียด เหมาะทั้งฟังเพลงและใช้งานจริงจังในงบคุ้มค่า",
    image:
      "https://cdn.shopify.com/s/files/1/0582/0317/7110/files/Kiwi_Ears_Astral_11.jpg?v=1744884763",
    buttonText: "Explore Here",
  },
  {
    id: 2,
    title: "Moondrop Blessing 3",
    text: "IEM Hybrid ระดับเรือธงสายคุ้มค่า ให้เสียงบาลานซ์ รายละเอียดสูง เวทีเสียงกว้าง เบสกระชับ กลางชัดเจน แหลมใสโปร่ง เหมาะทั้งนักฟังจริงจังและสาย Audiophile",
    image:
      "https://static.wixstatic.com/media/e15cb5_b5dfc2593ed446cc80a5a784f3afcfbb~mv2.webp",
    buttonText: "Explore Here",
  },
  {
    id: 3,
    title: "7HZ Sonus",
    text: "IEM เสียงบาลานซ์ เบสอุ่นลงตัว รายละเอียดกลางเด่น แหลมไม่บาดหู ฟังสบายยาวๆ เหมาะทั้งเพลงสบายๆ และใช้งานประจำวันในงบคุ้มค่า",
    image:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fconceptkart.com%2Fcdn%2Fshop%2Ffiles%2FConcept-Kart-7HZ-Sonus-IEM-Black-1-_5_62bd0d04-94d2-44f6-965b-f4fe80f0ac1b_900x.jpg%3Fv%3D1695470334&f=1&nofb=1&ipt=a0b249e5a62183b975c6a66e3be624c7d6bfac55331b00ec4bea14a4aeef479f",
    buttonText: "Explore Here",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, type: "spring", stiffness: 100 },
  }),
};

export default function Card() {
  return (
    <div className="container py-5 ">
      <div className="row justify-content-center">
        {cardData.map((card, i) => (
          <motion.div
            key={card.id}
            className="col-12 col-sm-10 col-md-6 col-lg-4 mb-4 d-flex "
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            }}
          >
            <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden w-100 bg-dark text-light">
              <motion.img
                src={card.image}
                alt={card.title}
                className="card-img-top"
                style={{ height: "220px", objectFit: "cover", width: "100%" }}
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.08 }}
                transition={{ type: "spring", stiffness: 200 }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold">{card.title}</h5>
                <p className="card-text text-light flex-grow-1">{card.text}</p>
                <a
                  href="https://www.linsoul.com/products"
                  target="_blank"
                  className="btn btn-primary mt-auto rounded-pill"
                >
                  {card.buttonText}
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
