"use client";
import Carousel from "./components/carousel";
import Card from "./components/card";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #232526 0%, #414345 100%)",
        minHeight: "100vh",
      }}
    >
      <Carousel />
      <motion.div
        className="d-flex flex-column align-items-center justify-content-center text-center py-5"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.h1
          className="h3 mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          style={{
            color: "#fff",
            letterSpacing: 2,
            fontWeight: 700,
            textShadow: "0 2px 8px #0007",
          }}
        >
          อินเอียร์
        </motion.h1>
        <motion.p
          className="lead mb-4"
          style={{
            color: "#e0e0e0",
            maxWidth: 700,
            whiteSpace: "pre-line",
            fontSize: 18,
            lineHeight: 1.7,
            textShadow: "0 1px 4px #0005",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
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
        <motion.h1
          className="h3 mb-3 mt-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          style={{
            color: "#fff",
            letterSpacing: 2,
            fontWeight: 700,
            textShadow: "0 2px 8px #0007",
          }}
        >
          In-Ear
        </motion.h1>
        <motion.p
          className="lead mb-4"
          style={{
            color: "#e0e0e0",
            maxWidth: 700,
            whiteSpace: "pre-line",
            fontSize: 18,
            lineHeight: 1.7,
            textShadow: "0 1px 4px #0005",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          {`Discover premium In-Ear Monitors (IEMs) designed for audiophiles, gamers,
and professional musicians. Our curated selection delivers precise sound
with deep bass, clear mids, and sparkling highs—all in a comfortable,
durable design perfect for everyday listening or live performance.
We provide in-depth reviews, expert buying guides, and exclusive deals
on the most trusted IEM brands worldwide. Experience sound the way it was meant to be heard.`}
        </motion.p>
      </motion.div>
      <motion.div
        className="container py-0"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h2
          className="text-center mb-4"
          style={{ color: "#fff", textShadow: "0 1px 4px #0005" }}
        >
          IEMs I recommend
        </h2>
        <Card />
      </motion.div>
    </div>
  );
}
