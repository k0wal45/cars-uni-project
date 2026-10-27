import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import type { Car } from '../models/Car';
import { deleteCar, getCars } from '../services/carService';

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    getCars(controller.signal)
      .then(data => setCars(data))
      .catch(err => {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : 'Nie udało się pobrać samochodów.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      'Czy na pewno chcesz usunąć ten samochód?'
    );

    if (!confirmed) return;

    try {
      await deleteCar(id);
      setCars(previous => previous.filter(car => car.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udało się usunąć samochodu.');
    }
  }

  if (isLoading) return <p>Ładowanie...</p>;

  return (
    <section>
      <h1>Samochody</h1>

      {error && <p className="error">{error}</p>}

      {!error && cars.length === 0 && <p>Brak samochodów na liście.</p>}

      {cars.length > 0 && (
        <ul className="car-list">
          {cars.map(car => (
            <li key={car.id} className="car-item">
              <span>{car.brand} {car.model}</span>
              <div className="actions">
                <Link className="button" to={`/cars/${car.id}`}>Szczegóły</Link>
                <Link className="button" to={`/cars/${car.id}/edit`}>Edytuj</Link>
                <button className="danger" onClick={() => handleDelete(car.id)}>Usuń</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
