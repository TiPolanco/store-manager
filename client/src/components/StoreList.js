import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useStoreManager } from '../hooks/useStoreManager.js';
import { useUserAuth } from '../hooks/useUserAuth.js';

const StoreList = () => {
    const [formData, setFormData] = useState({});
    const [isCreate, setIsCreate] = useState(false);
    const navigate = useNavigate();
    const { user } = useUserAuth();
    const {
        createStore,
        error,
        fetchStores,
        isCreatingStores,
        isFetchingStores,
        stores,
    } = useStoreManager();
    const isCreationAllowed = user?.role === 1;

    useEffect(() => {
        fetchStores();
    }, []);

    const handleStoreClick = (storeID) => {
        console.log('QA: click', storeID);
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

        // Access Control
        if (!isCreationAllowed) return;

        const isSuccess = await createStore(formData);
        if (isSuccess) setFormData({});
    };

    const renderCreationForm = () => (
        <div className="store-creation-form-container">
            <form className="store-creation-form" onSubmit={handleSubmit}>
                <h4>Create Store</h4>
                <div className="store-creation-form-input-group">
                    <label>Name</label>
                    <input
                        name="name"
                        onChange={handleChange}
                        type="text"
                        value={formData.name}
                    />
                </div>
                <div className="store-creation-form-input-group">
                    <label>Description</label>
                    <input
                        name="desc"
                        onChange={handleChange}
                        type="text"
                        value={formData.desc}
                    />
                </div>

                <p>{error?.message}</p>

                <button onClick={toggleCreate}>Back</button>
                <button type="submit">Create</button>
            </form>
        </div>
    );

    const renderStores = () => (
        <div className="store-list-container">
            {isCreationAllowed && (<button onClick={toggleCreate}>Create Store</button>)}
            {stores.map(({ id, name, desc }) => (
                <div
                    className="store-item-container"
                    key={id}
                    style={{ border: '1px solid black', margin: '20px' }}
                    onClick={() => handleStoreClick(id)}
                >
                    <h4>{name}</h4>
                    <p>{desc}</p>
                </div>
            ))}
        </div>
    );

    return (
        <div className="store-view-container">
            {
                (isFetchingStores || isCreatingStores) && 'Loading...'
            }
            {isCreate
                ? renderCreationForm()
                : renderStores()
            }
        </div>
    );
};

export default StoreList;