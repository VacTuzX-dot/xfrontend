"use client";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Carousel() {
  const carouselRef = useRef(null);
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <motion.div
      id="myCarousel"
      className="carousel slide"
      data-bs-ride="carousel"
      ref={carouselRef}
      style={{
        width: "100vw",
        height: "60vh",
        minHeight: 750,
        maxWidth: "100%",
        margin: "0 auto",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
        background: "linear-gradient(135deg, #232526 0%, #414345 100%)",
        position: "relative",
        border: "1.5px solid rgba(255,255,255,0.08)",
      }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div className="carousel-inner">
        <div className="carousel-item active">
          <motion.img
            src="/images/image1.jpg"
            className="d-block"
            alt="Slide 1"
            style={{
              width: "100vw",
              height: "100vh",
              objectFit: "cover",
              objectPosition: "center",
              filter: "brightness(0.92) saturate(1.1)",
              transition: "filter 0.4s",
            }}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
          <motion.div
            className="carousel-caption"
            style={{
              bottom: 32,
              background: "rgba(0,0,0,0.32)",
              borderRadius: 8,
              padding: "0.5rem 1.5rem",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            {/* <h5 style={{ fontWeight: 600, fontSize: 28, color: '#fff' }}>Headline 1</h5>
            <p style={{ fontSize: 16, opacity: 0.8 }}>First slide content.</p> */}
          </motion.div>
        </div>
        <div className="carousel-item">
          <motion.img
            src="/images/image2.png"
            className="d-block"
            alt="Slide 2"
            style={{
              width: "100vw",
              height: "100vh",
              objectFit: "cover",
              objectPosition: "center",
              filter: "brightness(0.92) saturate(1.1)",
              transition: "filter 0.4s",
            }}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
          <motion.div
            className="carousel-caption"
            style={{
              bottom: 32,
              background: "rgba(0,0,0,0.32)",
              borderRadius: 8,
              padding: "0.5rem 1.5rem",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            {/* <h5 style={{ fontWeight: 600, fontSize: 28, color: '#fff' }}>Headline 2</h5>
            <p style={{ fontSize: 16, opacity: 0.8 }}>Second slide content.</p> */}
          </motion.div>
        </div>
        <div className="carousel-item">
          <motion.img
            src="/images/image3.png"
            className="d-block"
            alt="Slide 3"
            style={{
              width: "100vw",
              height: "100vh",
              objectFit: "cover",
              objectPosition: "center",
              filter: "brightness(0.92) saturate(1.1)",
              transition: "filter 0.4s",
            }}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
          <motion.div
            className="carousel-caption"
            style={{
              bottom: 32,
              background: "rgba(0,0,0,0.32)",
              borderRadius: 8,
              padding: "0.5rem 1.5rem",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            {/* <h5 style={{ fontWeight: 600, fontSize: 28, color: '#fff' }}>Headline 3</h5>
            <p style={{ fontSize: 16, opacity: 0.8 }}>Third slide content.</p> */}
          </motion.div>
        </div>
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#myCarousel"
        data-bs-slide="prev"
        style={{
          width: 80,
          height: 80,
          top: "50%",
          left: 10,
          transform: "translateY(-50%)",
          background: "rgba(0,0,0,0.18)",
          borderRadius: "50%",
          border: "none",
        }}
      >
        <span
          className="carousel-control-prev-icon"
          aria-hidden="true"
          style={{ filter: "drop-shadow(0 2px 6px #000)" }}
        />
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#myCarousel"
        data-bs-slide="next"
        style={{
          width: 80,
          height: 80,
          top: "50%",
          right: 10,
          transform: "translateY(-50%)",
          background: "rgba(0,0,0,0.18)",
          borderRadius: "50%",
          border: "none",
        }}
      >
        <span
          className="carousel-control-next-icon"
          aria-hidden="true"
          style={{ filter: "drop-shadow(0 2px 6px #000)" }}
        />
        <span className="visually-hidden">Next</span>
      </button>
      <div className="carousel-indicators" style={{ bottom: 18 }}>
        <button
          type="button"
          data-bs-target="#myCarousel"
          data-bs-slide-to="0"
          className="active"
          aria-current="true"
          aria-label="Slide 1"
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            margin: "0 6px",
            background: "#fff",
            border: "2px solid #888",
          }}
        />
        <button
          type="button"
          data-bs-target="#myCarousel"
          data-bs-slide-to="1"
          aria-label="Slide 2"
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            margin: "0 6px",
            background: "#fff",
            border: "2px solid #888",
          }}
        />
        <button
          type="button"
          data-bs-target="#myCarousel"
          data-bs-slide-to="2"
          aria-label="Slide 3"
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            margin: "0 6px",
            background: "#fff",
            border: "2px solid #888",
          }}
        />
      </div>
    </motion.div>
  );
}
