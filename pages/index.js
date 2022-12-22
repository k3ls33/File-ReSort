import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import Navigation from '../components/Navigation'
import HomeHeader from '../components/HomeHeader'
import DocumentList from '../components/DocumentList';

const Home = () => {
    return (
        <div>
            <Head>
                <title>File ReSort</title>
                <link rel="icon" href="favicon.ico" />
            </Head>
            <div className={styles.container}>
                <Navigation />

                <div className={styles.NonNav}>
                    <HomeHeader />

                    <div className={styles.MainContent}>
                        <div className={styles.flex}>
                            <h2>All Files</h2>
                            <Link href="/upload/1">
                                <button className="ui small green button"><i className="plus icon"></i>add more</button>
                            </Link>
                        </div>

                        <DocumentList />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Home;
