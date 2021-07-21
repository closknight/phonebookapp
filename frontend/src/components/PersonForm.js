import { useMutation } from '@apollo/client';
import React from 'react';
import { useField } from '../hooks';
import { CREATE_PERSON } from '../quaries';

export default function PersonForm({ setError, updateCacheWith }) {
  const name = useField('text');
  const phone = useField('text');
  const street = useField('text');
  const city = useField('text');

  const [ createPerson ] = useMutation(CREATE_PERSON, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message);
    },
    update: (store, response) => {
      updateCacheWith(response.data.addPerson);
    }
  });
  
  const sumbit = (event) => {
    event.preventDefault();
    createPerson( {variables: { 
      name:name.value, 
      phone: phone.value.length > 0 ? phone.value: null, 
      street:street.value, 
      city:city.value 
    }});
    name.reset();
    phone.reset();
    street.reset();
    city.reset();
  }

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={sumbit}>
        <div>name <input {...name.props}/></div>
        <div>phone <input {...phone.props}/></div>
        <div>street <input {...street.props}/></div>
        <div>city <input {...city.props}/></div>
        <button type="submit">add!</button>
      </form>
    </div>
  )
}