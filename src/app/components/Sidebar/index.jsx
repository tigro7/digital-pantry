import Link from "next/link";
import styles from "./sidebar.module.css";

const Sidebar = () => (
    <div className={styles.sidebar}>
        <ul>
            <li><Link href="/ingredienti">Ingredienti</Link></li>
            <li><Link href="/inventario">Inventario</Link></li>
            <li><Link href="/menusettimanale">Menu Settimanale</Link></li>
            <li><Link href="/ricette">Ricette</Link></li>
        </ul>
    </div>
);

export default Sidebar;
