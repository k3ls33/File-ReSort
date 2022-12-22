import React, { useState, useMemo } from 'react';
import { Element, Text, ToggleEditableButtonButton } from '../lib/inlines';
import { initCheck, deleteIDs, getSlateJSON } from '../lib/spacy-to-slate';
import { withHistory } from 'slate-history';
import { Toolbar } from '../lib/slate-components';
import { createEditor } from 'slate';
import { Editable, withReact } from 'slate-react';
import * as SlateReact from 'slate-react';
import styles from '../styles/DocEditor.module.css';
import { useRouter } from 'next/router';
import { Button, Checkbox, Dropdown, Form } from 'semantic-ui-react';

const withInlines = editor => {
    const { insertData, insertText, isInline } = editor

    editor.isInline = element =>
        ['link', 'button'].includes(element.type) || isInline(element)

    editor.insertText = text => {
        insertText(text);
    }

    editor.insertData = data => {
        insertData(data);
    }

    return editor
}

export default function DocEditor() {
    const spacy = window.localStorage.getItem('docStorage');
    const [data, setData] = useState(getSlateJSON(JSON.parse(spacy)));
    const [checked, setChecked] = useState(initCheck(data));
    //const [rules, setRules] = useState([]);
    const router = useRouter();

    function handleChange(event) {
        const ID = event.target.id;
        const newChecked = checked;
        const index = newChecked.findIndex((box) => box.value == ID);

        newChecked[index].checked = !(newChecked[index].checked);

        setChecked(newChecked);
    }

    function handleDelete() {
        const IDs = [];

        checked.forEach(box => {
            if (box.checked == true) {
                IDs.push(box.value);
            }
        })

        setData(deleteIDs(IDs, data));
    }

    function handleSave() {
        const out = data[0].children;
        const tags = [];

        out.forEach((obj) => {
            if (obj.type == "button") {
                tags.push({
                    tag: obj.tag,
                    value: obj.value,
                    text: obj.children[0].text
                })
            }
        });

        const tagStorage = JSON.stringify(tags);
        window.localStorage.setItem('tagStorage', tagStorage);
        router.push('/upload/3')
    }

    const Checkboxes = () => {
        const boxes = initCheck(data);
        return boxes.map((box) => (
            <div><Checkbox id={box.value} key={box.value} label={box.text} onChange={handleChange} /></div>
        ))
    }

    const MyEditor = () => {
        const editor = useMemo(
            () => withInlines(withHistory(withReact(createEditor()))),
            []
        );

        return (
            <SlateReact.Slate editor={editor} value={data} onChange={setData}>
                <Toolbar style={{
                    paddingTop: "6px",
                    textAlign: "right"
                }}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 'bold'}}>
                        <div style={{display: 'flex', gap: '10px'}}>
                            Key:
                            <div style={{backgroundColor: '#f4e7ff', padding: '0 8px', fontSize: '0.9rem', border: '1px solid #ce94ff'}}>
                                LAW
                            </div>
                            <div style={{backgroundColor: '#e3ecff', padding: '0 8px', fontSize: '0.9rem', border: '1px solid #a9c5ff'}}>
                                ORG
                            </div>
                        </div>
                        
                        <ToggleEditableButtonButton />
                    </div>
                </Toolbar>
                <Editable
                    renderElement={props => <Element {...props} />}
                    renderLeaf={props => <Text {...props} />}
                    placeholder="Enter some text..."
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
                    <h4><b>Entities</b></h4>

                    <div className={styles.tagList}>
                        <Checkboxes />
                    </div>

                    <div style={{ display: 'flex' }}>
                        <Button size='mini' onClick={handleDelete}>
                            <img src="../trash3.svg" height={16} width={16} />
                        </Button>
                    </div>
                </div>

                <div className={styles.section}>
                    <h4><b>Rules</b></h4>

                    <Form size='small'>
                        <Form.Group inline>
                            <Form.Field><Dropdown data={[]} placeholder="Entity 1" /></Form.Field>
                            <Form.Field><Dropdown data={[]} placeholder="Relationship" /></Form.Field>
                            <Form.Field><Dropdown data={[]} placeholder="Entity 2" /></Form.Field>
                            <Form.Field><Button size='small'>+</Button></Form.Field>
                        </Form.Group>
                    </Form>
                </div>

                <div className={styles.section}>
                    <Button onClick={handleSave}>
                        Save and Continue
                    </Button>
                </div>
            </div>
        </div>
    );
}