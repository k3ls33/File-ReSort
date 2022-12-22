import Head from 'next/head';
import styles from '../../styles/Home.module.css'
import RulesList from '../../components/RulesList';
import Navigation from '../../components/Navigation';
import  HomeHeader from '../../components/HomeHeader'

export default function documents() {
    return (
        <div>
            <Head>
                <title>File ReSort</title>
                <link rel="icon" href="favicon.ico" />
            </Head>
            <div>
                <Navigation />
                <div className={styles.rules}>
                    <HomeHeader />
                    <div className={styles.MainContent}>
                        <div className={styles.flex}>
                        <h2>All Rules</h2>
                        </div> 

                        <RulesList />
                    </div>
                </div>
            </div>
        </div>

    );
}