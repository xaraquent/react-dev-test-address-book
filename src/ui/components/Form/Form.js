import React from 'react';
import Button from '../Button/Button'; // Import the Button component

const Form = ({
    legend,
    fields,
    onSubmit,
    submitButtonLabel,
    resetForm,
    resetButtonLabel,
}) => {
    return (
        <form onSubmit={onSubmit}>
            <fieldset>
                <legend>{legend}</legend>

                {fields.map((field) => (
                    <div className='form-row' key={field.name}>
                        {field.component ? (
                            field.component // Render a custom component if provided
                        ) : (
                            <input
                                type={field.type || 'text'} // Default to 'text' if type is not provided
                                name={field.name}
                                placeholder={field.placeholder}
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    </div>
                ))}

                <Button type='submit'>{submitButtonLabel}</Button>

                {resetForm && (
                    <Button
                        type='button'
                        onClick={resetForm}
                        className='secondary'
                    >
                        {resetButtonLabel || 'Clear Form'}
                    </Button>
                )}
            </fieldset>
        </form>
    );
};

export default Form;
