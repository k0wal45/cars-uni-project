import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { NewCar } from '../models/Car';

interface CarFormProps {
  initialCar?: NewCar;
  submitLabel: string;
  onSubmit: (car: NewCar) => Promise<void>;
}

// Pola formularza trzymamy jako tekst, aby pozwolić na puste wartości podczas edycji.
type CarFormValues = Record<keyof NewCar, string>;

const emptyValues: CarFormValues = {
  brand: '',
  model: '',
  doorsNumber: '',
  luggageCapacity: '',
  engineCapacity: '',
  fuelType: '',
  productionDate: '',
  averageFuelConsumption: '',
  bodyType: ''
};

function toValues(car: NewCar): CarFormValues {
  return {
    brand: car.brand,
    model: car.model,
    doorsNumber: String(car.doorsNumber),
    luggageCapacity: String(car.luggageCapacity),
    engineCapacity: String(car.engineCapacity),
    fuelType: String(car.fuelType),
    productionDate: car.productionDate,
    averageFuelConsumption: String(car.averageFuelConsumption),
    bodyType: String(car.bodyType)
  };
}

export default function CarForm({ initialCar, submitLabel, onSubmit }: CarFormProps) {
  const [values, setValues] = useState<CarFormValues>(
    initialCar ? toValues(initialCar) : emptyValues
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setValues(previous => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const car: NewCar = {
      brand: values.brand,
      model: values.model,
      doorsNumber: Number(values.doorsNumber),
      luggageCapacity: Number(values.luggageCapacity),
      engineCapacity: Number(values.engineCapacity),
      fuelType: Number(values.fuelType),
      productionDate: values.productionDate,
      averageFuelConsumption: Number(values.averageFuelConsumption),
      bodyType: Number(values.bodyType)
    };

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(car);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udało się zapisać samochodu.');
      setIsSubmitting(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Marka
        <input name="brand" value={values.brand} onChange={handleChange} required />
      </label>

      <label>
        Model
        <input name="model" value={values.model} onChange={handleChange} required />
      </label>

      <label>
        Liczba drzwi
        <input type="number" name="doorsNumber" min="1" value={values.doorsNumber} onChange={handleChange} required />
      </label>

      <label>
        Pojemność bagażnika (l)
        <input type="number" name="luggageCapacity" min="0" value={values.luggageCapacity} onChange={handleChange} required />
      </label>

      <label>
        Pojemność silnika (cm³)
        <input type="number" name="engineCapacity" min="0" value={values.engineCapacity} onChange={handleChange} required />
      </label>

      <label>
        Rodzaj paliwa
        <input type="number" name="fuelType" min="0" value={values.fuelType} onChange={handleChange} required />
      </label>

      <label>
        Data produkcji
        <input type="date" name="productionDate" value={values.productionDate} onChange={handleChange} required />
      </label>

      <label>
        Średnie spalanie (l/100 km)
        <input type="number" name="averageFuelConsumption" min="0" step="0.1" value={values.averageFuelConsumption} onChange={handleChange} required />
      </label>

      <label>
        Typ nadwozia
        <input type="number" name="bodyType" min="0" value={values.bodyType} onChange={handleChange} required />
      </label>

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Zapisywanie...' : submitLabel}
      </button>
    </form>
  );
}
