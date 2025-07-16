"use client";
import { useEffect } from "react";
export default function Carousel() {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <div
      id="myCarousel"
      className="carousel slide"
      data-bs-ride="carousel"
      style={{
        maxWidth: "100vw",
        margin: "0 auto",
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 5px 20px 12px rgba(0,0,0,0.5)",
      }}
    >
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img
            src="/images/image1.jpg"
            className="d-block vw-100 vh-auto"
            alt="Slide 1"
            style={{ objectContain: "contain" }}
          />
          <div className="carousel-caption" style={{ bottom: 20 }}>
            {/* <h5 style={{ fontWeight: 500 }}>Headline 1</h5>
            <p style={{ fontSize: 14, opacity: 0.7 }}>First slide content.</p> */}
          </div>
        </div>
        <div className="carousel-item">
          <img
            src="/images/image2.png"
            className="d-block vw-100 vh-auto"
            alt="Slide 2"
            style={{ objectContain: "contain" }}
          />
          <div className="carousel-caption" style={{ bottom: 20 }}>
            {/* <h5 style={{ fontWeight: 500 }}>Headline 2</h5>
            <p style={{ fontSize: 14, opacity: 0.7 }}>Second slide content.</p> */}
          </div>
        </div>
        <div className="carousel-item">
          <img
            src="/images/image3.png"
            className="d-block vw-100 vh-auto"
            alt="Slide 3"
            style={{ objectContain: "contain" }}
          />
          <div className="carousel-caption" style={{ bottom: 20 }}>
            {/* <h5 style={{ fontWeight: 500 }}>Headline 3</h5>
            <p style={{ fontSize: 14, opacity: 0.7 }}>Third slide content.</p> */}
          </div>
        </div>
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#myCarousel"
        data-bs-slide="prev"
        style={{ width: 100 }}
      >
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#myCarousel"
        data-bs-slide="next"
        style={{ width: 100 }}
      >
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="visually-hidden">Next</span>
      </button>
      <div className="carousel-indicators" style={{ bottom: 10 }}>
        <button
          type="button"
          data-bs-target="#myCarousel"
          data-bs-slide-to="0"
          className="active"
          aria-current="true"
          aria-label="Slide 1"
        />
        <button
          type="button"
          data-bs-target="#myCarousel"
          data-bs-slide-to="1"
          aria-label="Slide 2"
        />
        <button
          type="button"
          data-bs-target="#myCarousel"
          data-bs-slide-to="2"
          aria-label="Slide 3"
        />
      </div>
    </div>
  );
}
