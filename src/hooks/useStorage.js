import { useState, useEffect } from 'react';
import { db, auth, storage, timestamp } from '../config/firebaseConfig';

const useStorage = (file) => {
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [url, setUrl] = useState(null);

    useEffect(() => {
        const fileName = file.name;
    }, [file]);
    return {}
}

export default useStorage
