import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <section>
      <h1>404 – Nie znaleziono strony</h1>
      <p>Podany adres nie istnieje.</p>
      <Link className="button" to="/">Wróć do strony głównej</Link>
    </section>
  );
}
