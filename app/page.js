"use client";
import Carousel from "./components/carousel";
import Card from "./components/card";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const BG_IMAGE = "/images/bg.png";

export default function Home() {
  return (
    <div className="position-relative min-vh-100 overflow-hidden text-white">
      {/* Background layer with image */}
      <div
        aria-hidden
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          zIndex: -999,
        }}
      >
        <img
          src={BG_IMAGE}
          alt="Background"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(12px)",
          }}
        />
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.60) 50%, rgba(0,0,0,0.70) 100%)",
            opacity: 0.4,
          }}
        />
      </div>

      {/* Minimal top area: keep existing carousel */}
      <Carousel />

      {/* Hero / Copy block with subtle Framer Motion + frosted card */}
      <div className="d-flex flex-column align-items-center justify-content-center text-center py-5">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          style={{
            maxWidth: 820,
            borderRadius: 24,
            padding: 24,
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.14)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          }}
        >
          <motion.h1
            className="h3 mb-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            style={{
              color: "#fff",
              letterSpacing: 1,
              fontWeight: 700,
              textShadow: "none",
            }}
          >
            อินเอียร์
          </motion.h1>

          <motion.p
            className="lead mb-4"
            style={{
              color: "#e6e6e6",
              whiteSpace: "pre-line",
              fontSize: 18,
              lineHeight: 1.7,
              textShadow: "none",
              margin: "0 auto",
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {`เว็บไซต์ของเราคือแหล่งรวม In-Ear Monitor (IEM) คุณภาพสูง
สำหรับทั้งนักฟังเพลงทั่วไปและนักดนตรีมืออาชีพ
เราคัดสรรหูฟังอินเอียร์ที่ให้รายละเอียดเสียงครบถ้วน สมดุลทุกย่านความถี่
ตั้งแต่เบสที่ลึกแน่น มิดเรนจ์ที่คมชัด ไปจนถึงเสียงแหลมที่ใสสะอาด
พร้อมดีไซน์ที่สวมใส่สบายและทนทาน เหมาะทั้งการฟังเพลงทุกแนว การเล่นเกม
ไปจนถึงการใช้งานบนเวทีจริง
เราเชื่อว่าเสียงที่ดีสามารถยกระดับประสบการณ์ดนตรีและความบันเทิงของคุณได้
ที่นี่คุณจะพบรีวิวเชิงลึก คำแนะนำการเลือกซื้อ
และโปรโมชั่นสุดพิเศษสำหรับ IEM รุ่นยอดนิยมและรุ่นใหม่ล่าสุด
จากแบรนด์ที่นักฟังทั่วโลกไว้วางใจ`}
          </motion.p>

          <motion.h2
            className="h3 mb-3 mt-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            style={{
              color: "#fff",
              letterSpacing: 1,
              fontWeight: 700,
              textShadow: "none",
            }}
          >
            In-Ear
          </motion.h2>

          <motion.p
            className="lead mb-0"
            style={{
              color: "#e6e6e6",
              whiteSpace: "pre-line",
              fontSize: 18,
              lineHeight: 1.7,
              textShadow: "none",
              margin: "0 auto",
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {`Discover premium In-Ear Monitors (IEMs) designed for audiophiles, gamers,
and professional musicians. Our curated selection delivers precise sound
with deep bass, clear mids, and sparkling highs—all in a comfortable,
durable design perfect for everyday listening or live performance.
We provide in-depth reviews, expert buying guides, and exclusive deals
on the most trusted IEM brands worldwide. Experience sound the way it was meant to be heard.`}
          </motion.p>
        </motion.div>
      </div>

      {/* Product section */}
      <div className="container py-4">
        <h2
          className="text-center mb-4"
          style={{ color: "#fff", textShadow: "none" }}
        >
          IEMs I recommend
        </h2>
        <Card />
      </div>
    </div>
  );
}
