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
        const validationError = typeof dataValidation === 'function'
            ? dataValidation(data)
            : '';
        if (validationError) {
            if (onError) onError({ message: validationError });
            setError({ message: validationError });
            return false;
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

        setIsLoading(false);
        return isSuccess;
    }, [dataValidation, method, onError, onSuccess, options, url]);

    return {
        error,
        isLoading,
        makeRequest,
    };
};

export default useHttpRequest;