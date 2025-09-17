export default function Home() {
  return (
    <>
      <h1>My CV</h1>
      <iframe
        src="/CV.pdf"
        title="CV PDF"
        style={{ width: '90vw', height: '90vh', border: '1px solid #ccc' }}
      />
    </>
  );
}
