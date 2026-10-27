import { Link } from 'react-router';

export default function HomePage() {
  return (
    <section>
      <h1>Cars Client</h1>
      <p>
        Aplikacja do zarządzania listą samochodów. Pozwala przeglądać, dodawać,
        edytować i usuwać samochody.
      </p>
      <Link className="button" to="/cars">Przejdź do listy samochodów</Link>
    </section>
  );
}
