import { useState } from "react";
import { useRouter } from "next/router";
import { Button, Container, Menu } from 'semantic-ui-react';
import styles from '../styles/AddFiles.module.css';
import UserUpload from './UserUpload';

const spacyExample = {
    "annotations": [
        [
            " §1. Office of the Comptroller of the Currency\n(a) Office of the Comptroller of the Currency established\n\nThere is established in the Department of the Treasury a bureau to be known as the \"Office of the Comptroller of the Currency\" which is charged with assuring the safety and soundness of, and compliance with laws and regulations, fair access to financial services, and fair treatment of customers by, the institutions and other persons subject to its jurisdiction.\n(b) Comptroller of the Currency\n(1) In general\n\nThe chief officer of the Office of the Comptroller of the Currency shall be known as the Comptroller of the Currency. The Comptroller of the Currency shall perform the duties of the Comptroller of the Currency under the general direction of the Secretary of the Treasury. The Secretary of the Treasury may not delay or prevent the issuance of any rule or the promulgation of any regulation by the Comptroller of the Currency, and may not intervene in any matter or proceeding before the Comptroller of the Currency (including agency enforcement actions), unless otherwise specifically provided by law.\n\nThe Comptroller of the Currency is advised by the Secretary of the Treasury federal commerce",
            {
                "entities": [
                    [
                        5,
                        46,
                        "LEGAL_ORGANIZATION"
                    ],
                    [
                        51,
                        92,
                        "LEGAL_ORGANIZATION"
                    ],
                    [
                        134,
                        160,
                        "LEGAL_ORGANIZATION"
                    ],
                    [
                        190,
                        231,
                        "LEGAL_ORGANIZATION"
                    ],
                    [
                        474,
                        501,
                        "PERSON"
                    ],
                    [
                        543,
                        584,
                        "LEGAL_ORGANIZATION"
                    ],
                    [
                        607,
                        634,
                        "PERSON"
                    ],
                    [
                        640,
                        667,
                        "PERSON"
                    ],
                    [
                        700,
                        727,
                        "PERSON"
                    ],
                    [
                        763,
                        788,
                        "PERSON"
                    ],
                    [
                        794,
                        819,
                        "PERSON"
                    ],
                    [
                        915,
                        942,
                        "PERSON"
                    ],
                    [
                        1005,
                        1032,
                        "PERSON"
                    ],
                    [
                        1125,
                        1152,
                        "PERSON"
                    ],
                    [
                        1171,
                        1196,
                        "PERSON"
                    ],
                    [
                        1197,
                        1204,
                        "LEGAL_ORGANIZATION"
                    ],
                    [
                        1205,
                        1213,
                        "CONCEPT"
                    ]
                ]
            }
        ]
    ]
}

export default function AddFiles() {
    const [selection, setSelection] = useState(0);
    const [navigate, doNavigation] = useState(0);

    const router2 = useRouter();

    function handleClick() {
        if (selection === 1) {
            doNavigation(1);
        } else {
            window.localStorage.setItem('docStorage', JSON.stringify(spacyExample));
            router2.push('/upload/2');
        }
    }

    const Stage = () => {
        if (navigate === 0) {
            return (
                <div>
                    <div className={styles.Inner}>
                        <h3 className={styles.Title}>What would you like to do?</h3>

                        <Menu secondary>
                            <Menu.Item name='Try a Sample File' active={selection === 0} onClick={() => setSelection(0)} />
                            <Menu.Item name='Upload a File' active={selection === 1} onClick={() => setSelection(1)} />
                        </Menu>
                    </div>
                    <div className={styles.Continue}>
                        <div></div>
                        <Button primary onClick={() => handleClick()}>Next</Button>
                    </div>
                </div>
            )
        } else {
            return (
                <>
                    <UserUpload />
                </>
            )
        }
    }

    return (
        <div className={styles.UploadContainer}>
            <Stage />
        </div>
    );
}