// `app/menusettimanale/page.tsx` is the UI for the `/menusettimanale` URL
import MenuSettimanale from './menusettimanale';
import styles from './menusettimanale.module.css';
 
export default async function Page() {

  return (
    <>
      <h3 className={styles.title}>Menu Settimanale</h3>
      <MenuSettimanale />
    </>
  )
}