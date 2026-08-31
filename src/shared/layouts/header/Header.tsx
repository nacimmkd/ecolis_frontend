import Icon from "@/shared/components/icon/Icon";
import Text from "@/shared/components/text/Text";
import useAuth from "@/features/auth/hooks/useAuth";
import useMyProfileQuery from "@/features/profile/hooks/useMyProfileQuery.ts";
import styles from "./Header.module.css"
import { Link } from "react-router-dom";
import { paths } from "@/app/routes/paths";
import {Car, ChevronDown, ChevronUp, LogOut, Package, User} from "lucide-react";
import { useRef, useState } from "react";
import Menu from "@/shared/components/menu/Menu";
import MenuItem from "@/shared/components/menu/MenuItem";
import Divider from "@/shared/components/divider/Divider";
import Button from "@/shared/components/button/Button";
import NotificationBell from "@/features/notifications/components/NotificationBell/NotificationBell.tsx";
import MessageBell from "@/features/messages/components/MessageBell/MessageBell.tsx";
import useClickOutside from "@/shared/hooks/useClickOutside.ts";

export default function Header() {

    const { logout , isAuthenticated, isLoading} = useAuth();
    const { profile } = useMyProfileQuery();
    const avatarUrl = profile?.avatarUrl ?? "/avatar.png";
    const profileRef = useRef<HTMLDivElement>(null);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    useClickOutside(profileRef, () => setIsMenuOpen(false));

    return (
        <div className={styles.container}>
            <div className={styles.left_container}>
                <Link to={paths.home} className={styles.logo_container}>
                    <Icon src="/logo.png" size={40} />
                    <Text className={styles.logo_text} tag="h3" weight="bold" color="white">ecolis</Text>
                </Link>
            </div>

            {!isAuthenticated && ( 
                <div className={styles.right_container}>
                    <div className={styles.login_container}>
                        <Link to={paths.login} className={styles.login_button}>
                            Connexion
                        </Link>
                        <Link to={paths.signup} className={styles.signin_button}>Inscription</Link>
                    </div>
                </div> 
            )}


            {isAuthenticated && (
                <div className={styles.right_container}>
                    <NotificationBell />
                    <MessageBell />
                    <div
                        ref={profileRef}
                        onClick={() => setIsMenuOpen((v) => !v)}
                        className={styles.profile_container}
                    >
                        <img src={avatarUrl} alt="avatar" />
                        {!isMenuOpen && <ChevronDown size={20} color="white"/> }
                        {isMenuOpen && <ChevronUp size={20} color="white"/> }
                        <Menu isOpen={isMenuOpen}>
                            <MenuItem label="Mes Colis" to={paths.parcels_list} icon={<Package size={20} />} />
                            <MenuItem label="Mes Trajets" to={paths.trips} icon={<Car size={20} />} />
                            <Divider/>
                            <MenuItem label="Profil" to={paths.profile} icon={<User size={20} />} />
                            <Divider/>
                            <Button label={"Déconnexion"} variant="danger" onClick={logout} loading={isLoading} icon={<LogOut size={20} />}/>
                        </Menu>
                    </div>
                </div>
            )}
            
        </div>
    );
}