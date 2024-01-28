import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useStoreManager } from '../hooks/useStoreManager.js';

import './styles/store-detail.css';

const StoreDetail = () => {
    const { storeID } = useParams();
    const { stores, fetchStores, isFetchingStores } = useStoreManager();
    const store = stores.find(({ id }) => id === Number(storeID));
    console.log('QA: detail', { stores, store, storeID });
    
    useEffect(() => {
        if (!stores.length && !isFetchingStores) {
            fetchStores();
        }
    }, []);

    const renderStoreDetail = () => (
        <>
            <h3>#{storeID} - {store.name}</h3>
            <p>{store.desc}</p>
        </>
    );

    return (
        <div className="store-detail-container">
            <div className="store-detail-display">
                {!store
                    ? 'The selected store no longer exist'
                    : renderStoreDetail()
                }
            </div>
            <div className="store-detail-shcedule"></div>
            <div className="store-detail-booking"></div>
        </div>
    )
};

export default StoreDetail;