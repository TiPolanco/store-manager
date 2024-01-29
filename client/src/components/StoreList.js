import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useStoreManager } from '../hooks/useStoreManager.js';
import AuthWrapper from '../utils/AuthWrapper.js';

import Loader from './Loader.js';

import './styles/store-list.css'

const StoreList = () => {
    const [formData, setFormData] = useState({});
    const [isCreate, setIsCreate] = useState(false);
    const navigate = useNavigate();
    const {
        createStore,
        error,
        isCreatingStores,
        isFetchingStores,
        stores,
    } = useStoreManager();

    const handleStoreClick = (storeID) => {
        navigate(`/store/${storeID}`);
    };

    const handleChange = useCallback((e) => {
        const newValue = e.target.value;
        const name = e.target.name;

        setFormData((prevData) => ({
            ...prevData,
            [name]: newValue,
        }));
    }, []);

    const toggleCreate = useCallback((e) => {
        e.preventDefault();

        setIsCreate((prevValue) => !prevValue);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isSuccess = await createStore(formData);

        if (isSuccess) {
            setFormData({});
            setIsCreate(false);
        }
    };

    const renderCreationForm = () => (
        <AuthWrapper  requiredRoles={[1]}>
            <div className="store-creation-form-container">
                <form className="store-creation-form" onSubmit={handleSubmit}>
                    <h4>Create Store</h4>
                    <div className="form-input-group">
                        <label>Name</label>
                        <input
                            name="name"
                            onChange={handleChange}
                            type="text"
                        />
                    </div>
                    <div className="form-input-group">
                        <label>Description</label>
                        <input
                            name="desc"
                            onChange={handleChange}
                            type="text"
                        />
                    </div>

                    <p>{error?.message}</p>

                    <div className="form-btn-group">
                        <button className="secondary" onClick={toggleCreate}>Back</button>
                        <button className="primary" type="submit">Create</button>
                    </div>
                </form>
            </div>
        </AuthWrapper>
    );

    const renderStores = () => (
        <div className="store-list-container">
            {stores.map(({ id, name, desc }) => (
                <div
                    className="store-item-container"
                    key={id}
                    onClick={() => handleStoreClick(id)}
                >
                    <div className="mm-image store" />
                    <h4>{name}</h4>
                    <p>{desc}</p>
                </div>
            ))}
        </div>
    );

    return (
        <div className="store-view-container">
            {
                (isFetchingStores || isCreatingStores) && <Loader />
            }
            <div className="store-list-header-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="store-list-header">
                    Stores
                </div>
                <div className="store-list-btn">
                    <AuthWrapper  requiredRoles={[1]}>
                        <button className="secondary" onClick={toggleCreate}>Create Store</button>
                    </AuthWrapper>
                </div>
            </div>
            {isCreate
                ? renderCreationForm()
                : renderStores()
            }
        </div>
    );
};

export default StoreList;