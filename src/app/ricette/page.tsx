// `app/ricette/page.tsx` is the UI for the `/ricette` URL
import Ricette from './ricette';
import styles from './ricette.module.css';
 
export default async function Page() {

  return (
    <>
      <h3 className={styles.title}>Ricette</h3>
      <Ricette />
    </>
  )
}