// `app/ingredienti/page.tsx` is the UI for the `/ingredienti` URL
import Ingredienti from './ingredienti';
import styles from './ingredienti.module.css';
 
export default async function Page() {

  return (
    <>
      <h3 className={styles.title}>Elenco Ingredienti</h3>
      <Ingredienti />
    </>
  )
}