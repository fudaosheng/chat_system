import classNames from 'classnames';
import { EmptyContent, NoContacts } from 'components/empty';
import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';



export const Chat: React.FC = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    console.log(window.ws);
    
  }, [window.ws]);
  return (
    <div className={styles.chat}>
      <div className={classNames(styles.contacts, { [styles.emptyContacts]: !contacts.length })}>
          {contacts.length ? null : NoContacts}
      </div>
      <div className={styles.conversations}>
          {EmptyContent}
      </div>
    </div>
  );
};
