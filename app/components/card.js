"use client";
import React from "react";
import { motion } from "framer-motion";

const cardData = [
    {
        id: 1,
        title: "Card Title 1",
        text: "Some quick example text to build on the card title and make up the bulk of the card's content.",
        image:
            "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/2e/d2/d9/2ed2d9f6-537e-69b7-0347-1fdd881a2c97/197342224826_cover.jpg/1200x1200bf-60.jpg",
        buttonText: "Go somewhere",
    },
    {
        id: 2,
        title: "Card Title 2",
        text: "Some quick example text to build on the card title and make up the bulk of the card's content.",
        image:
            "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/2e/d2/d9/2ed2d9f6-537e-69b7-0347-1fdd881a2c97/197342224826_cover.jpg/1200x1200bf-60.jpg",
        buttonText: "Learn more",
    },
    {
        id: 3,
        title: "Card Title 3",
        text: "Some quick example text to build on the card title and make up the bulk of the card's content.",
        image:
            "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/2e/d2/d9/2ed2d9f6-537e-69b7-0347-1fdd881a2c97/197342224826_cover.jpg/1200x1200bf-60.jpg",
        buttonText: "Read more",
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
        <div className="container py-5">
            <div className="row justify-content-center">
                {cardData.map((card, i) => (
                    <motion.div
                        key={card.id}
                        className="col-12 col-sm-10 col-md-6 col-lg-4 mb-4 d-flex"
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants}
                        whileHover={{
                            scale: 1.05,
                            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                        }}
                    >
                        <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden w-100">
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
                                <p className="card-text text-muted flex-grow-1">{card.text}</p>
                                <a href="#" className="btn btn-primary mt-auto rounded-pill">
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
