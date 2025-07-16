import Carousel from "./components/carousel";
import Card from "./components/card";

export default function Home() {
  return (
    <>
      <div>
        <Carousel />
      </div>
      <div className="d-flex flex-column align-items-center justify-content-center vh-100">
        <h1 className="h4">Mr.Taweesak Numma</h1>
        <h2 className="h5">Home page</h2>
      </div>
      <div className="container py-0">
        <h2 className="text-center mb-4">Cards</h2>
        <Card />
      </div>
    </>
  );
}
