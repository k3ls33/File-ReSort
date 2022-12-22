import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import styles from '../styles/Documents.module.css';

const DocumentList = () => {
    const [documents, setDocuments] = useState([]);
    const router = useRouter();
/*
    useEffect(() => {
      // Fetch the list of documents from the API
      fetch('https://cr8qhi8bu6.execute-api.us-east-1.amazonaws.com/prod/documents')
        .then(response => response.json())
        .then(data => {
          //console.log(data);
          setDocuments(data);
        });
    }, []);
*/
    function handleClick(e) {
      e.preventDefault();
      const id = e.target.id;
      
      window.localStorage.setItem('currentID', id);
      
      router.push('/documents/view');
    }

    function formatDate(input) {
      const date = new Date(input);
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();

      return (
          <span>
              {`${month} ${day}${day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'}, ${year}`}
          </span>
      );
    }

  const Table = () => {
    return (
      <table className="ui celled small table">
          <thead>
            <tr>
              <th className={styles.tableHeader}>Name</th>
              <th className={styles.tableHeader}>File Name</th>
              <th className={styles.tableHeader}>Upload Date</th>
              <th className={styles.tableHeader}>Edit Date</th>
            </tr>
          </thead>
          <tbody>
            {documents.map(document => (
              <tr className={styles.tableRow} key={document.ID}>
                <td className="selectable">
                    <a className={styles.link} id={document.ID} href='#' onClick={handleClick} style={{color: '#4a88cb'}}>
                      {document.Name}
                    </a>
                </td>
                <td className={styles.tableCell}>{document.FileName}</td>
                <td className={styles.tableCell}>{formatDate(document.UploadDate)}</td>
                <td className={styles.tableCell}>{formatDate(document.LastEditDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
    )
  }
  
    return (
      <div className={styles.Inner}>
        {(documents.length > 1) ? (
          <Table/>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    );
  };
  
  export default DocumentList;