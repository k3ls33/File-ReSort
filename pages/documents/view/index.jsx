import Head from 'next/head';
import Link from 'next/link';
import React, { useState, useMemo, useEffect } from 'react';
import onKeyDown, { Element, Text } from '../../../lib/inlines';
import { initCheck, getSlateJSON, } from '../../../lib/spacy-to-slate';
import { withHistory } from 'slate-history';
import { Toolbar } from '../../../lib/slate-components';
import { createEditor } from 'slate';
import { Editable, withReact } from 'slate-react';
import * as SlateReact from 'slate-react';
import styles from '../../../styles/ViewDocument.module.css';
import { Button } from 'semantic-ui-react';
import { useRouter } from 'next/router';

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

export default function documents() {
    const [data, setData] = useState({
        Meta: {
            BucketFileLocation: "",
            UploadDate: "",
            LastEditDate: "",
            FileName: "",
            ID: "",
            Name: "Loading..."
        },
        annotations: []
    });
    const [rules, setRules] = useState([]);
    const [ID, setID] = useState(-1);
    const router = useRouter();
    
    /*
    useEffect(() => {
        
        if (rules.length < 1) {
            
            fetch('https://cr8qhi8bu6.execute-api.us-east-1.amazonaws.com/prod/rules')
                .then((response) => response.json())
                .then((res) => {
                    setRules(res);
                })
                .catch((err) => {
                    console.log(err.message);
                    throw new Error("Could not get Rules Data: " + err.message);
                });
        } else if (ID === -1) {
            const current = window.localStorage.getItem('currentID');
            setID(current);
        } else {
            if (data.annotations.length < 1) {
                console.log(ID);
                fetch('https://cr8qhi8bu6.execute-api.us-east-1.amazonaws.com/prod/document?ID=' + ID)
                    .then((response) => response.json())
                    .then((res) => {
                        //change from body to annotations
                        Object.defineProperty(res, 'annotations', {
                            value: res.body,
                            enumerable: true,
                            writable: true,
                        });
                        delete res.body;
                        const slate = getSlateJSON(res);

                        window.localStorage.setItem('docStorage', slate);
                        setData({ Meta: res.Meta, annotations: slate });
                    })
                    .catch((err) => {
                        console.log(err.message);
                        throw new Error("Could not get Document Data: " + err.message);
                    });
            }
        }
    });
    */

    const Entities = () => {
        const boxes = initCheck(data.annotations);
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

    function handleClick() {
        router.push('/upload/2');
    }

    const FileInfo = () => {
        return (
            <div className={styles.headingContainer}>
                <div className={styles.headingCol}>
                    <h1 className={styles.heading}>{data.Meta.Name}</h1>

                </div>
                <div className={styles.headingCol}>
                    <h3 className={styles.date}>Uploaded: {formatDate(data.Meta.UploadDate)}</h3>
                    <h3 className={styles.date}>Edit: {formatDate(data.Meta.LastEditDate)}</h3>
                    <h3 className={styles.title}>{data.Meta.FileName}</h3>
                </div>
            </div>

        );
    }

    const Rules = () => {
        const listItems = rules.map((rule) =>
            <li key={rule.ruleID}>
                {rule.Word} {rule.Rule} {rule.Relationship}
            </li>
        );
        return (
            <ul>
                {listItems}
            </ul>
        );
    }

    const MyEditor = () => {
        const editor = useMemo(
            () => withInlines(withHistory(withReact(createEditor()))),
            []
        );

        return (
            <SlateReact.Slate editor={editor} value={data.annotations}>
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
        <div>
            <Head>
                <title>File ReSort</title>
                <link rel="icon" href="../favicon.ico" />
            </Head>
            <div className={styles.container}>
                <div className={styles.AppTop}>
                    <Link href={"/"} style={{ display: "flex" }}>
                        <img src="../logo.png" alt="logo" width="58" height="54" />
                        <div>
                            <h1 id={styles.header}>File ReSort</h1>
                            <span id={styles.caption}>View document</span>
                        </div>
                    </Link>
                </div>

                <div className={styles.Content}>
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
                                    <Button size="large" disabled>
                                        Edit File
                                    </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}