import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import CarForm from '../components/CarForm';
import type { Car, NewCar } from '../models/Car';
import { getCarById, updateCar } from '../services/carService';

export default function EditCarPage() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  async function handleSubmit(updated: NewCar) {
    if (!id) return;
    await updateCar(id, updated);
    navigate(`/cars/${id}`);
  }

  return (
    <section>
      <h1>Edytuj samochód</h1>

      {isLoading && <p>Ładowanie...</p>}
      {error && <p className="error">{error}</p>}

      {car && (
        <CarForm
          initialCar={car}
          submitLabel="Zapisz zmiany"
          onSubmit={handleSubmit}
        />
      )}

      <p>
        <Link to={`/cars/${id}`}>← Powrót do szczegółów</Link>
      </p>
    </section>
  );
}
