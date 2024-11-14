/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import useFetch from "../hooks/useFetch";
import WeeklySelector from "../components/WeeklySelector";
import { Dispatch, SetStateAction, useState } from "react";
import { Meal } from "../lib/definitions";

const getNextMonday = () => {
  const today = new Date();
  const day = today.getDay();
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + ((8 - day) % 7));  // Calcola il prossimo lunedì
  return nextMonday;
};
  
const getDatesForWeek = (selectedWeek) => {
  const startDate = getDateFromWeekNumber(selectedWeek);
  const weekDates: Date[] = [];
  
  for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      weekDates.push(date);
  }

  return weekDates;
};

const getMealByTypeAndDay = (meals, mealType, day) => {
  if (!meals || !Array.isArray(meals)) {
      return "Nessun piatto";
  }
  return meals.find(meal => meal.pranzo === mealType && meal.giorno === day)?.ricetta || "Nessun piatto";
};

const MealPlanner = ({ meals, options, onMealChange, selectedWeek }) => {
  const weekDates = getDatesForWeek(selectedWeek);

  return (
    <div>
      {weekDates.map((date, index) => (
        <div key={index}>
          <h3>{date.toLocaleDateString()}</h3>
          <ul>
            <li>
                Colazione: 
                {getMealByTypeAndDay(meals, 'colazione', index)}
                <select onChange={(e) => onMealChange('colazione', index + 1, e.target.value)}>
                    <option key={-1} value={""} />
                    {options?.map((option, i) => 
                      <option key={i} value={option.ricetta}>{option.ricetta}</option>
                    )}
                </select>
            </li>
            <li>
                Pranzo:
                {getMealByTypeAndDay(meals, 'pranzo', index)}
                <select onChange={(e) => onMealChange('pranzo', index + 1, e.target.value)}>
                    <option key={-1} value={""} />
                    {options?.map((option, i) => 
                      <option key={i} value={option.ricetta}>{option.ricetta}</option>
                    )}
                </select>
            </li>
            <li>
                Cena:
                {getMealByTypeAndDay(meals, 'cena', index)}
                <select onChange={(e) => onMealChange('cena', index + 1, e.target.value)}>
                    <option key={-1} value={""} />
                    {options?.map((option, i) => 
                      <option key={i} value={option.ricetta}>{option.ricetta}</option>
                    )}
                </select>
            </li>
          </ul>
        </div>
      ))}
    </div>
  );
};

const saveMenu = async (menu, selectedWeek) => {
  try {
    const response = await fetch('/api/menusettimanale', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ menu, selectedWeek }),
    });
    
    if (response.ok) {
      console.log('Menu salvato con successo!');
    } else {
      console.error('Errore nel salvataggio del menu');
    }
  } catch (error) {
    console.error('Errore:', error);
  }
};

const getWeekNumberFromDate = (date) => {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - startOfYear.valueOf()) / (24 * 60 * 60 * 1000));

  return `${Math.ceil((date.getDay() + 1 + days) / 7)}_${date.getFullYear()}`;
};

const getDateFromWeekNumber = (selectedWeek) => {
  const weekNumber = parseInt(selectedWeek.split('_')[0]);
  const year = parseInt(selectedWeek.split('_')[1]);
  // Calcola il primo giorno dell'anno
  const startOfYear = new Date(year, 0, 1);
  
  // Trova il primo lunedì dell'anno
  const dayOfWeek = startOfYear.getDay();
  const firstMonday = new Date(startOfYear);
  firstMonday.setDate(startOfYear.getDate() + (dayOfWeek <= 1 ? 1 - dayOfWeek : 8 - dayOfWeek));

  // Calcola il giorno della settimana desiderata
  const targetDate = new Date(firstMonday);
  targetDate.setDate(firstMonday.getDate() + (weekNumber - 1) * 7);

  return targetDate;
};
  
const MenuSettimanale = () => {
  const [selectedWeek, setSelectedWeek] = useState(getWeekNumberFromDate(getNextMonday()));
  const {data, loading, error, setData} = useFetch(`/api/menusettimanale/${selectedWeek}`);
  let menuSettimanale = [] as Meal[];
  if (data.length > 0 && data[0]){
    if ('menu' in data[0]){
      menuSettimanale = data[0]['menu'] as Meal[];
    }
  }
  const setMenuSettimanale = setData as Dispatch<SetStateAction<Meal[]>>;
  const {data: ricettePesate, loading: loadingRic, error: errorRic, } = useFetch(`/api/ricettepesate`);

  const handleMealChange = (mealType, day, newMeal) => {
    const updatedMeals = menuSettimanale?.map(meal => 
      meal.pranzo === mealType && meal.giorno === day 
        ? { ...meal, ricetta: newMeal } 
        : meal
    ) || [];
    setMenuSettimanale(updatedMeals);
  };

  const handleWeekSelect = ({ year, week }) => {
    setSelectedWeek(`${week}_${year}`);
  }

  if (loading || loadingRic) return <div>Caricamento...</div>;
  if (error) return <div>Errore: {error}</div>;
  if (errorRic) return <div>Errore: {errorRic}</div>;
  
  return (
    <div>
      <WeeklySelector onSelect={handleWeekSelect} selectedWeek={selectedWeek} />
      <MealPlanner
        meals={menuSettimanale}
        options={ricettePesate}
        onMealChange={handleMealChange}
        selectedWeek={selectedWeek}
      />
      <button onClick={() => saveMenu(menuSettimanale, selectedWeek)}>Salva Menu</button>
    </div>
  );
}

export default MenuSettimanale;