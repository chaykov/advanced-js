import React, { useState } from "react";
import { useObservations } from "../context/ObservationContext";
import { useNavigate } from "react-router-dom";

function ObservationForm() {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    type: "UFO", // domyślny typ
  });
  const { addObservation } = useObservations();
  const navigate = useNavigate();
  // ... (reszta kodu formularza pozostaje bez zmian)

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Tytuł jest wymagany";
    if (!formData.date) newErrors.date = "Data jest wymagana";
    if (!formData.time) newErrors.time = "Czas jest wymagany";
    if (!formData.location.trim())
      newErrors.location = "Lokalizacja jest wymagana";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      addObservation({
        ...formData,
        id: Date.now(),
        timestamp: new Date(`${formData.date}T${formData.time}`).toISOString(),
      });
      setFormData({
        title: "",
        date: "",
        time: "",
        location: "",
        description: "",
        type: "UFO",
      });
      setErrors({});
      navigate("/observations"); // Przekierowanie do listy obserwacji po dodaniu
    }
  };

  // ... (reszta kodu formularza pozostaje bez zmian)

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-36">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-300"
        >
          Tytuł
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-300"
          >
            Data
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          />
          {errors.date && (
            <p className="text-red-500 text-xs mt-1">{errors.date}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="time"
            className="block text-sm font-medium text-gray-300"
          >
            Czas
          </label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
          />
          {errors.time && (
            <p className="text-red-500 text-xs mt-1">{errors.time}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-300"
        >
          Lokalizacja
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
        />
        {errors.location && (
          <p className="text-red-500 text-xs mt-1">{errors.location}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="type"
          className="block text-sm font-medium text-gray-300"
        >
          Typ obserwacji
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
        >
          <option value="UFO">UFO</option>
          <option value="Zjawisko astronomiczne">Zjawisko astronomiczne</option>
          <option value="Inny">Inny</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-300"
        >
          Opis
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition duration-300"
      >
        Dodaj obserwację
      </button>
    </form>
  );
}

export default ObservationForm;
