import React from 'react';

import Address from './ui/components/Address/Address';
import AddressBook from './ui/components/AddressBook/AddressBook';
import Radio from './ui/components/Radio/Radio';
import Section from './ui/components/Section/Section';
import useAddressBook from './ui/hooks/useAddressBook';
import useForm from './ui/hooks/useForm';
import Form from './ui/components/Form/Form';
import transformAddress from './core/models/address';

import './App.css';

function App() {
    /**
     * Form fields states
     * TODO: Write a custom hook to set form fields in a more generic way:
     * - Hook must expose an onChange handler to be used by all <InputText /> and <Radio /> components
     * - Hook must expose all text form field values, like so: { zipCode: '', houseNumber: '', ...etc }
     * - Remove all individual React.useState
     * - Remove all individual onChange handlers, like handleZipCodeChange for example
     */
    const { formData, handleInputChange, resetForm } = useForm({
        zipCode: '',
        houseNumber: '',
        firstName: '',
        lastName: '',
    });
    const [selectedAddress, setSelectedAddress] = React.useState('');
    /**
     * Results states
     *
     *
     *
     */
    const [error, setError] = React.useState(undefined);
    const [addresses, setAddresses] = React.useState([]);
    /**
     * Redux actions
     */
    const { addAddress } = useAddressBook();

    /**
     * Text fields onChange handlers
     */

    /** TODO: Fetch addresses based on houseNumber and zipCode
     * - Example URL of API: http://api.postcodedata.nl/v1/postcode/?postcode=1211EP&streetnumber=60&ref=domeinnaam.nl&type=json
     * - Handle errors if they occur
     * - Handle successful response by updating the `addresses` in the state using `setAddresses`
     * - Make sure to add the houseNumber to each found address in the response using `transformAddress()` function
     * - Bonus: Add a loading state in the UI while fetching addresses
     */

    const handleAddressSubmit = async (e) => {
        e.preventDefault();

        const { zipCode, houseNumber } = formData;

        // Basic validation
        if (!zipCode || !houseNumber) {
            setError('Please enter both a zip code and house number.');
            return;
        }

        setError(undefined); // Clear previous errors

        try {
            // Construct the API URL with dynamic zip code and house number
            const response = await fetch(
                `http://api.postcodedata.nl/v1/postcode/?postcode=${zipCode}&streetnumber=${houseNumber}&ref=domeinnaam.nl&type=json`
            );

            // Handle the response
            if (!response.ok) {
                throw new Error('Failed to fetch addresses.');
            }

            const data = await response.json();

            // Check if valid addresses are returned
            if (data && data.status === 'ok' && data.details.length > 0) {
                // Transform and store addresses (assuming transformAddress function is provided)
                const transformedAddresses = data.details.map(transformAddress);
                setAddresses(transformedAddresses);
            } else {
                setError(
                    'No addresses found for the given zip code and house number.'
                );
            }
        } catch (err) {
            setError('Error fetching addresses: ' + err.message);
        }
    };
    const handlePersonSubmit = (e) => {
        e.preventDefault();
        if (!selectedAddress || !addresses.length) {
            setError(
                "No address selected, try to select an address or find one if you haven't."
            );
            return;
        }

        const foundAddress = addresses.find(
            (address) => address.id === selectedAddress
        );
        addAddress({ ...foundAddress, ...formData });
    };

    // Address form fields
    const addressFields = [
        {
            name: 'zipCode',
            placeholder: 'Zip Code',
            value: formData.zipCode,
            onChange: handleInputChange,
        },
        {
            name: 'houseNumber',
            placeholder: 'House Number',
            value: formData.houseNumber,
            onChange: handleInputChange,
        },
    ];

    // Personal info form fields
    const personalInfoFields = [
        {
            name: 'firstName',
            placeholder: 'First Name',
            value: formData.firstName,
            onChange: handleInputChange,
        },
        {
            name: 'lastName',
            placeholder: 'Last Name',
            value: formData.lastName,
            onChange: handleInputChange,
        },
    ];

    return (
        <main>
            <Section>
                <h1>
                    Create your own address book!
                    <br />
                    <small>
                        Enter an address by zipcode add personal info and done!
                        👏
                    </small>
                </h1>
                {/* Address Form */}
                <Form
                    legend='🏠 Find an address'
                    fields={addressFields}
                    onSubmit={handleAddressSubmit}
                    submitButtonLabel='Find'
                />

                {/* Display addresses as Radio buttons */}
                {addresses.length > 0 &&
                    addresses.map((address) => (
                        <Radio
                            name='selectedAddress'
                            id={address.id}
                            key={address.id}
                            onChange={(e) => setSelectedAddress(e.target.value)}
                        >
                            <Address address={address} />
                        </Radio>
                    ))}

                {/* Personal Information Form */}
                {selectedAddress && (
                    <Form
                        legend='✏️ Add personal info to address'
                        fields={personalInfoFields}
                        onSubmit={handlePersonSubmit}
                        submitButtonLabel='Add to addressbook'
                        resetForm={resetForm}
                        resetButtonLabel='Clear Form'
                    />
                )}

                {/* TODO: Create an <ErrorMessage /> component for displaying an error message */}
                {error && <div className='error'>{error}</div>}

                {/* TODO: Add a button to clear all form fields. Button must look different from the default primary button, see design. */}
            </Section>

            <Section variant='dark'>
                <AddressBook />
            </Section>
        </main>
    );
}

export default App;
