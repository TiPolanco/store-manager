import { useState } from 'react';

import './styles/modal.css';

const Modal = ({
    action,
    children,
    classname,
    input,
    onCancel,
    onComplete,
    title,
    isOpen,
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const trigerAction = async () => {
        setIsLoading(true);
        const isSuccess = await action(input);
        if (onComplete) onComplete(isSuccess);
        setIsLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="mm-modal-bg">
            <div className={`mm-modal ${classname}`}>
                {isLoading && 'Loading...'}
                <h2>{title}</h2>
                { children }
                <div className="mm-modal-btn-group">
                    <button onClick={onCancel} className="secondary">Cancel</button>
                    <button onClick={trigerAction} className="primary">Proceed</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
