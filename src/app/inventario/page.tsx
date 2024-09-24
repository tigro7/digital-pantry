// `app/inventario/page.tsx` is the UI for the `/inventario` URL
import Dispensa from './inventario';
import styles from './inventario.module.css';
 
export default async function Page() {

  return (
    <>
      <h3 className={styles.title}>Gestione Dispensa</h3>
      <Dispensa />
    </>
  )
}