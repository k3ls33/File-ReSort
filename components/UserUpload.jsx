import { useEffect, useState } from "react";
import 'uikit/dist/css/uikit.min.css';
import UIkit from 'uikit'
import Icons from 'uikit/dist/js/uikit-icons'
import { Button, Container } from 'semantic-ui-react';
import styles from '../styles/AddFiles.module.css';
import Link from "next/link";
import DOMPurify from 'dompurify';
import { useRouter } from 'next/router';

export default function UserUpload() {
    const [title, setTitle] = useState('');
    const [invalidTitle, setInvalidTitle] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userDoc, setUserDoc] = useState(false);
    const [invalidDoc, setInvalidDoc] = useState(false);

    const router = useRouter();
    UIkit.use(Icons);

    const Name = () => {
        let name = userDoc.name;

        if (name) {
            return name === '' ? (<label></label>) : (<label> {name} <span uk-icon="check"></span></label>);
        } else {
            return (<label></label>);
        }
    }

    function handleTitle(e) {
        setTitle(e.target.value);
    }

    function handleChange(e) {
        const file = e.target.files[0];
        setUserDoc(file);
    }

    function handleSubmit(e) {
        e.preventDefault();
        var formdata = new FormData();
        var requestOptions =
        {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        const val = title.trim();

        if (val < 2 || val > 20) {
            setInvalidTitle(true);
        } else {
            if (userDoc) {
                formdata.append("file", userDoc);
/*
                fetch("https://fileresortproc.ngrok.io/processor/getAnnotations", requestOptions)
                    .then(response => response.text())
                    .then(result => {
                        window.localStorage.setItem('docStorage', result);
                        router.push('/upload/2');
                    })
                    .catch(error => {
                        console.log('error', error);
                    });
*/
                setLoading(true);
            } else {
                setInvalidDoc(true);
            }
        }
    }

    if (loading) {
        return (
            <div>
                <div className={styles.Inner}>
                    Loading...
                </div>
            </div>
        )
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className={styles.Inner}>
                    <div className="js-upload" style={{ width: '100%', paddingBottom: '20px' }} data-uk-form-custom>
                        <label className="uk-form-label" style={{ display: 'block' }}>Upload a File</label>
                        <input id="upload" type="file" accept=".txt" onChange={handleChange} />
                        <button className={'uk-button' + (invalidDoc ? ' uk-button-danger' : ' uk-button-default')} type="button">Select</button>
                        <Name />
                    </div>
                    
                    <div style={{ width: '100%' }}>
                        <label className="uk-form-label">Document Title</label>
                        <input className={'uk-input' + ((invalidTitle && (title.length < 1)) ? ' uk-form-danger' : '')} type="text" placeholder="Give the document a title"
                            pattern="\s?([\w\d]+[\s]?)+" value={title} onChange={handleTitle} />
                    </div>
                </div>

                <div className={styles.Continue}>
                    <Link href="/upload/1"><Button>Back</Button></Link>
                    <Button primary type="submit">Review and Edit</Button>
                </div>
            </form>
        </div>
    );
}