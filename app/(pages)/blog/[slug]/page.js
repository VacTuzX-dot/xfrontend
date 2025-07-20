export default async function BlogPost({ params }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  return (
    <div>
      <h1>บทความ: {decodedSlug}</h1>
      <p>เนื้อหาบทความภาษาไทยจะแสดงตรงนี้...</p>
    </div>
  );
}
