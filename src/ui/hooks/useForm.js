import { useState } from 'react';

const useForm = (initialState) => {
    const [formData, setFormData] = useState(initialState);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const resetForm = () => {
        setFormData(initialState);
    };

    return {
        formData,
        handleInputChange,
        resetForm,
    };
};

export default useForm;
