import React, { useState } from 'react';
import request from '../common/api';

export const HelloWord: React.FC = () => {
    const [count, setCount] = useState(0);
    return (
        <div>
            <p>counte: {count}</p>
            <button onClick={() => request({
                url:'/test/login'
            })}> + </button>
            <button onClick={() => setCount(count-1)}> - </button>
        </div>
    )
}