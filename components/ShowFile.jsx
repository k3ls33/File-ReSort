import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import onKeyDown, { Element, Text, ToggleEditableButtonButton } from '../lib/inlines';
import { initCheck, deleteIDs, getSlateJSON, updateIDs, Checkboxes } from '../lib/spacy-to-slate';
import { withHistory } from 'slate-history';
import { Toolbar } from '../lib/slate-components';
import { createEditor } from 'slate';
import { Editable, withReact } from 'slate-react';
import * as SlateReact from 'slate-react';
import styles from '../styles/ViewDocument.module.css';
import { useRouter } from 'next/router';
import { Button, Checkbox, Dropdown, Form, Select, ListItem } from 'semantic-ui-react';

const withInlines = editor => {
    const { insertData, insertText, isInline } = editor

    editor.isInline = element =>
        ['link', 'button'].includes(element.type) || isInline(element)

    editor.insertText = text => {
        if (text && isUrl(text)) {
            wrapLink(editor, text)
        } else {
            insertText(text)
        }
    }

    editor.insertData = data => {
        const text = data.getData('text/plain')

        if (text && isUrl(text)) {
            wrapLink(editor, text)
        } else {
            insertData(data)
        }
    }

    return editor
}

//backup if api fetch fails
const spacyTest = {
    "Meta": {
        "BucketFileLocation": "https://file-resort-storage.s3.amazonaws.com/4c01f6c4-43a8-4142-910a-a95ed1786299-example.txt",
        "UploadDate": "",
        "LastEditDate": "",
        "FileName": "",
        "ID": "4c01f6c4-43a8-4142-910a-a95ed1786299",
        "Name": "Loading..."
    },
    "body": [
        [
            "SPACY TEST FILE §1. Office of the Comptroller of the Currency\n(a) Office of the Comptroller of the Currency established\n\nThere is established in the Department of the Treasury a bureau to be known as the \"Office of the Comptroller of the Currency\" which is charged with assuring the safety and soundness of, and compliance with laws and regulations, fair access to financial services, and fair treatment of customers by, the institutions and other persons subject to its jurisdiction.\n(b) Comptroller of the Currency\n(1) In general\n\nThe chief officer of the Office of the Comptroller of the Currency shall be known as the Comptroller of the Currency. The Comptroller of the Currency shall perform the duties of the Comptroller of the Currency under the general direction of the Secretary of the Treasury. The Secretary of the Treasury may not delay or prevent the issuance of any rule or the promulgation of any regulation by the Comptroller of the Currency, and may not intervene in any matter or proceeding before the Comptroller of the Currency (including agency enforcement actions), unless otherwise specifically provided by law.\n\nThe Comptroller of the Currency is advised by the Secretary of the Treasury federal commerce",
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

export default function ShowFile() {
    const [meta, setMeta] = useState(spacyTest.Meta);
    const [data, setData] = useState(getSlateJSON(spacyTest));
    const [rules, setRules] = useState([]);
    const router = useRouter();
    let id = -1;
    if (typeof window !== "undefined") {
        id = (typeof router.query.id !== 'undefined' ? router.query.id : window.localStorage.getItem('id'));
        window.localStorage.setItem('id', id);
    }
    //window.localStorage.setItem('id', id);
    const editor = useMemo(
        () => withInlines(withHistory(withReact(createEditor()))),
        []
    );
    
    //get doc data
    /*
    useEffect(() => {
        fetch('https://cr8qhi8bu6.execute-api.us-east-1.amazonaws.com/prod/document?ID=' + id)
            .then((response) => response.json())
            .then((res) => {
                setMeta(res.Meta);
                setData(getSlateJSON(res));
            })
            .catch((err) => {
                console.log(err.message);
                throw new Error("Could not get Document Data: " + err.message);
            });
    }, []);
    
    //get all rules 
    useEffect(() => {
        fetch('https://cr8qhi8bu6.execute-api.us-east-1.amazonaws.com/prod/rules')
            .then((response) => response.json())
            .then((res) => {
                setRules(res);
            })
            .catch((err) => {
                console.log(err.message);
                throw new Error("Could not get Rules Data: " + err.message);
            });
    }, []);
*/
    const Entities = () => {
        const boxes = initCheck(data);
        const listItems = boxes.map((box) => 
            <li key={box.value}> 
                {box.text} 
            </li>
        );
        return (
            <ul>
                {listItems}
            </ul>
        );
    }

    const FileInfo = () => {
        return (
            <div className={styles.headingContainer}>
                <div className={styles.headingCol}>
                    <h1 className={styles.heading}>{meta.Name}</h1>
                    
                </div>
                <div className={styles.headingCol}>
                    <h3 className={styles.date}>Uploaded: {formatDate(meta.UploadDate)}</h3>
                    <h3 className={styles.date}>Edit: {formatDate(meta.LastEditDate)}</h3>
                    <h3 className={styles.title}>{meta.FileName}</h3>
                </div>
            </div>
            
        );
    }

    function formatDate(input) {
        const date = new Date(input);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';
        const formattedHours = (hours % 12) || 12; 

        return (
            <span>
                {`${month} ${day}${day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'}, ${year}, ${formattedHours}:${minutes}${ampm}`}
            </span>
        );
    }

    const Rules = () => {
        const listItems = rules.map((rule) => 
            <li key={rule.ruleID}> 
                { rule.Word} {rule.Rule} {rule.Relationship}
            </li>
        );
        return (
            <ul>
                {listItems}
            </ul>
        );
    }

    const MyEditor = () => {
        return (
            <SlateReact.Slate editor={editor} value={data} onChange={setData}>
                <Toolbar style={{
                    padding: "0px",
                }}>
                    <FileInfo />
                </Toolbar>
                <Editable
                    readOnly
                    renderElement={props => <Element {...props} />}
                    renderLeaf={props => <Text {...props} />}
                    placeholder="Enter some text..."
                    onKeyDown={event => onKeyDown(event, editor)}
                    style={{
                        padding: "16px",
                        lineHeight: "1.2em"
                    }}
                />
            </SlateReact.Slate>
        )
    }

    return (
        <div className={styles.editor}>
            <div className={styles.txtContainer}>
                <MyEditor />
            </div>

            <div className={styles.options}>
                <div className={styles.section}>
                    <h3>Entities</h3>

                    <div className={styles.tagList}>
                        <Entities />
                    </div>
                </div>

                <div className={styles.section}>
                    <h3>Rules</h3>
                    <div className={styles.tagList}>
                        <Rules />
                    </div>
                </div>

                <div className={styles.section}>
                    <Link href={"#"}>
                        <Button size="large">
                            Edit File
                        </Button>
                    </Link>
                    
                </div>
            </div>
        </div>
    );
}