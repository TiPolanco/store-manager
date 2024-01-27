import { useCallback, useState } from 'react';

const API_ENDPOINT = 'http://localhost:8000';

const useHttpRequest = ({
    dataValidation,
    method = 'GET',
    onError,
    onSuccess,
    options,
    url,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const makeRequest = useCallback(async (data) => {
        setError(null);
        let isSuccess = true;

        // Data Validation
        if (
            typeof dataValidation === 'function' &&
            !dataValidation(data)
        ) {
            const validationError = new Error('Invalid data.');
            if (onError) onError(validationError);
            setError(validationError);
        }

        setIsLoading(true);

        // Compute request options
        const requestOptions = {
            credentials: "include", // Enable cookie for CORS
            headers: { 'Content-Type': 'application/json' },
            method,
            ...(options || {}),
        };
        if (data) {
            requestOptions.body = JSON.stringify(data);
        }

        try {
            // Make request
            const response = await fetch(`${API_ENDPOINT}${url}`, requestOptions);
            const json = await response.json();

            // Handle response
            if (response.ok) {
                onSuccess(json);
            } else {
                if (onError) onError(json);
                setError(json);
                isSuccess = false;
            }
        } catch (error) {
            if (onError) onError(error);
            setError(error);
            isSuccess = false;
        }

        setIsLoading(true);
        return isSuccess;
    }, [dataValidation, method, onError, onSuccess, options, url]);

    return {
        error,
        isLoading,
        makeRequest,
    };
};

export default useHttpRequest;