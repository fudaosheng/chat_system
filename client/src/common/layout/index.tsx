import React from 'react';
import styles from './index.module.css';
import { Nav } from './nav';

export const AppLayout: React.FC = props => {
    return (
        <div className={styles.layout}>
            <header className={styles.layout_header}></header>
            <div className={styles.layout_main}>
                <Nav className={styles.layout_main_nav}></Nav>
                <div className={styles.layout_main_content}>
                    {props.children}
                </div>
            </div>
            <footer className={styles.layout_footer}></footer>
        </div>
    )
}