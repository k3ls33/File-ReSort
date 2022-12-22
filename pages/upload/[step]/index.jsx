import Head from 'next/head';
import Link from 'next/link';
import styles from '../../../styles/Upload.module.css'
import { useRouter } from 'next/router';
import AddFiles from '../../../components/AddFiles';
import DocEditor from '../../../components/DocEditor';
import Finalize from '../../../components/Finalize';
import { Icon, Step } from 'semantic-ui-react';

export default function Upload() {
    const router = useRouter();
    const page = router.query.step;
    //const [data, setData] = useState();

    const Page = () => {
        switch (page) {
            case '1':
                return (<AddFiles />)
            case '2':
                return (<DocEditor />);
            case '3':
                return (<Finalize />);
        }
    };

    const Arrow = () => {
        return (<img className={styles.Arrow} src="../next.png" />);
    }

    return (
        <div>
            <Head>
                <title>File ReSort</title>
                <link rel="icon" href="../favicon.ico" />
            </Head>
            <div className={styles.container}>
                <div className={styles.AppTop}>
                    <Link className={styles.backButton} href="/">
                        <Icon name="arrow left" size='large' color='black' />
                    </Link>
                    <img src="../logo.png" alt="logo" width="58" height="54" />
                    <div>
                        <h1 id={styles.header}>File ReSort</h1>
                        <span id={styles.caption}>File Upload Wizard</span>
                    </div>
                    <div>
                        <Step.Group ordered size="small" className={styles.Steps}>
                            <Step active={page === '1'}>
                                <Step.Content>
                                    <Step.Title>Upload Files </Step.Title>
                                </Step.Content>
                                <Arrow />
                            </Step>

                            <Step active={page === '2'}>
                                <Step.Content>
                                    <Step.Title>Review and Edit</Step.Title>
                                </Step.Content>
                                <Arrow />
                            </Step>

                            <Step active={page === '3'}>
                                <Step.Content>
                                    <Step.Title>Finalize</Step.Title>
                                </Step.Content>
                            </Step>
                        </Step.Group>
                    </div>
                </div>

                <div className={styles.Content}>
                    <Page />
                </div>
            </div>
        </div>

    );
}