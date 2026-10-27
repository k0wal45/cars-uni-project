import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import type { Car } from '../models/Car';
import { getCarById } from '../services/carService';

export default function CarDetailsPage() {
  const { id } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    getCarById(id, controller.signal)
      .then(data => setCar(data))
      .catch(err => {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : 'Nie udało się pobrać samochodu.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [id]);

  return (
    <section>
      <h1>Szczegóły samochodu</h1>

      {isLoading && <p>Ładowanie...</p>}
      {error && <p className="error">{error}</p>}

      {car && (
        <>
          <dl className="details">
            <dt>Marka</dt>
            <dd>{car.brand}</dd>
            <dt>Model</dt>
            <dd>{car.model}</dd>
            <dt>Liczba drzwi</dt>
            <dd>{car.doorsNumber}</dd>
            <dt>Pojemność bagażnika</dt>
            <dd>{car.luggageCapacity} l</dd>
            <dt>Pojemność silnika</dt>
            <dd>{car.engineCapacity} cm³</dd>
            <dt>Rodzaj paliwa</dt>
            <dd>{car.fuelType}</dd>
            <dt>Data produkcji</dt>
            <dd>{car.productionDate}</dd>
            <dt>Średnie spalanie</dt>
            <dd>{car.averageFuelConsumption} l/100 km</dd>
            <dt>Typ nadwozia</dt>
            <dd>{car.bodyType}</dd>
          </dl>

          <Link className="button" to={`/cars/${car.id}/edit`}>Edytuj</Link>
        </>
      )}

      <p>
        <Link to="/cars">← Powrót do listy</Link>
      </p>
    </section>
  );
}
