import React, { useState } from 'react';

const isValidDomain = (domain) => {
  // Regular expression for a simple domain validation
  const domainPattern = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return domainPattern.test(domain);
};

const CreateDomain = () => {
  const [inputValue, setInputValue] = useState('');
  const [isValid, setIsValid] = useState(true);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    // Check if the entered domain is valid
    setIsValid(isValidDomain(value));
  };

  const handleSubmit = () => {
    if (isValid) {
      // Perform the action (e.g., insert into the database)
      console.log('Valid domain:', inputValue);
    } else {
      // Handle the case where the domain is not valid
      console.log('Invalid domain:', inputValue);
    }
  };

  return (
    <div>
      <label>
        Enter Domain:
        <input type="text" value={inputValue} onChange={handleInputChange} />
      </label>
      <button onClick={handleSubmit}>Submit</button>
      {!isValid && <p style={{ color: 'red' }}>Please enter a valid domain.</p>}
      {isValid && <p style={{ color: 'green'}}>{inputValue} is Valid domain</p>}
    </div>
  );
};

export default CreateDomain;
