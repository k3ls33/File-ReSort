import React from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function HomeHeader() {
    return (
        <div className={styles.HomeHeader}>
            <Link className={styles.logoLink} href="/">
                <img className={styles.logo} src="logo.png" alt="logo" width="58" height="54" />
                <h1 className={styles.title}>File ReSort</h1>
            </Link>
        </div>
    );
  };