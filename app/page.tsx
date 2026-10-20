import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <p className="breadcrumb">Home</p>
      <h1>Semiconductor Supply-Chain Explorer</h1>
      <p className="lead">Explore entities in the network, compare HITS hub rankings, and navigate supplier and customer relationships.</p>
      <div className="cards">
        <Link className="card" href="/top-1000">
          <h2>1000 entities with highest hub scores</h2>
          <p>Browse the top 1,000 entities ranked by HITS hub score.</p>
        </Link>
        <Link className="card" href="/search">
          <h2>Search by entity name</h2>
          <p>Enter at least four characters to find a matching entity.</p>
        </Link>
      </div>
    </>
  );
}
