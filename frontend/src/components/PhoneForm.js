import { useMutation } from '@apollo/client';
import React, { useEffect } from 'react';
import { useField } from '../hooks';
import { EDIT_NUMBER } from '../quaries';

export default function PhoneForm({ setError }) {
  const name = useField('text');
  const phone = useField('text');
  const [ changeNumber, result ] = useMutation(EDIT_NUMBER);

  const submit = (event) => {
    event.preventDefault();
    changeNumber({variables: { name: name.value, phone: phone.value } });
    name.reset();
    phone.reset();
  }

  useEffect(() => {
    if (result.data && result.data.editNumber === null) {
      setError('person not found');
    }
  }, [result.data]) // eslint-disable-line

  return (
    <div>
      <h2>Change number</h2>
      <form onSubmit={submit}>
        <div>name <input {...name.props} /></div>
        <div>phone <input {...phone.props} /></div>
        <button type="submit">change number</button>
      </form>
    </div>
  )
};
