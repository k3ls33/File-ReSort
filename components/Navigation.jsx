import React from 'react';
import Link from 'next/link';
import { Button, Placeholder } from 'semantic-ui-react';
import styles from '../styles/Home.module.css';

export default function Navigation() {

    const items = [
        { title: 'Home', href: '/' },
        { title: 'Upload Files', href: '/upload/1' },
        { title: 'Rules Database', href: '/rules' },
    ];

    return (
        /*
        <div className={styles.HomeNav}>
            {items.map(item => (
              <Button style={{marginTop: "2rem"}}className={styles.navItem}>
                {item}
              </Button>
            ))}
        </div>
        */
        <div class="ui left fixed inverted vertical menu">
            {items.map(item => (
                <Link className="item" key={item.title} href={item.href}>
                    {item.title}
                </Link>
            ))}
        </div>
    );
};