import React from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';
import styles from './index.module.scss';

const Link: React.FC<NavLinkProps> = (props: NavLinkProps) => {
    return <NavLink exact activeClassName={styles.active} {...props} />
}

interface NavProps {
    className: string;
}
export const Nav: React.FC<NavProps> = (props: NavProps) => {
    const { className } = props;
    return (
        <div className={className}>
            <Link to="/" >Home</Link>
            <Link to="/about" >About</Link>
        </div>
    )
}