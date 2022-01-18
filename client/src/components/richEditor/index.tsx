import React from 'react';
import styles from './index.module.scss';

interface Props {
    className?: string;
}
export const RichEditor: React.FC<Props> = (props: Props) => {
    const { className = '' } = props;
    return (
        <div className={`${styles.richEditor} ${className}`} contentEditable>

        </div>
    )
}