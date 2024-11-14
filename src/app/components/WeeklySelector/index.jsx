import React, { useState } from 'react';

const WeeklySelector = ({ onSelect, selectedWeek }) => {
  // Stati per anno e settimana
  const [year, setYear] = useState(parseInt(selectedWeek.split('_')[1]));
  const [week, setWeek] = useState(parseInt(selectedWeek.split('_')[0]));

  // Funzione per gestire la modifica dell'anno
  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  // Funzione per gestire la modifica della settimana
  const handleWeekChange = (e) => {
    let newWeek = parseInt(e.target.value, 10);
    if (newWeek >= 1 && newWeek <= 53) {
      setWeek(newWeek);
    }
  };

  // Funzione per inviare i dati selezionati
  const handleSelect = () => {
    if (onSelect) {
      onSelect({ year: parseInt(year, 10), week });
    }
  };

  return (
    <div>
      <div>
        <label>Anno:</label>
        <input 
          type="number" 
          value={year} 
          onChange={handleYearChange} 
          min="1900" 
          max="2100"
        />
      </div>
      <div>
        <label>Settimana:</label>
        <input 
          type="number" 
          value={week} 
          onChange={handleWeekChange} 
          min="1" 
          max="53"
        />
      </div>
      <button onClick={handleSelect}>Seleziona</button>
    </div>
  );
};

export default WeeklySelector;
