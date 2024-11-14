import React from 'react';
import styles from './page.module.css'; 
import Link from "next/link";

const LandingPage = () => {
  return (
    <div className={styles.container}>
      <h1>Benvenuti nella gestione del Menù</h1>
      <p>Seleziona una delle seguenti opzioni per iniziare:</p>
      <div className={styles.buttonContainer}>
        <Link href="/ingredienti" className='link'>Ingredienti</Link>
        <Link href="/inventario" className='link'>Inventario</Link>
        <Link href="/menusettimanale" className='link'>Menù Settimanale</Link>
        <Link href="/ricette" className='link'>Ricette</Link>
      </div>
    </div>
  );
};

export default LandingPage;