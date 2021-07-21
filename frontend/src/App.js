import { useApolloClient, useQuery, useSubscription } from '@apollo/client';
import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import PhoneForm from './components/PhoneForm';
import { ALL_PERSONS, PERSON_ADDED } from './quaries';

function Notify({ errorMessage }) {
  if (!errorMessage) return null;
  return(
    <div style={{color: 'red'}}>{errorMessage}</div>
  )
}


export default function App() {
  const result = useQuery(ALL_PERSONS);
  const [errorMessage, setErrorMessage] = useState(null);
  const [token, setToken] = useState(null);
  const client = useApolloClient();

  const updateCacheWith = (addedPerson) => {
    const includedIn = (set, obj) => set.map(p =>p.id).includes(obj.id);
    const dataInStore = client.readQuery({ query: ALL_PERSONS });
    if(!includedIn(dataInStore.allPersons, addedPerson)) {
      client.writeQuery({
        query: ALL_PERSONS,
        data: {
          allPersons: dataInStore.allPersons.concat(addedPerson)
        }
      })
    }
  };


  useSubscription(PERSON_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedPerson = subscriptionData.data.personAdded
      notify(`${addedPerson.name} added`);
      updateCacheWith(addedPerson);
    }
  })

  if (result.loading) {
    return <div>loading...</div>;
  }

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  }

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  };

  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage}/>
        <h2>Login</h2>
        <LoginForm 
          setToken={setToken}
          setError={notify}
        />
      </div>
    );
  }

  return(
  <div>
    <Notify errorMessage={errorMessage} />
    <Persons persons={result.data.allPersons} />
    <PersonForm setError={notify} updateCacheWith={updateCacheWith}/>
    <PhoneForm setError={notify} />
    <button onClick={logout}>logout</button>
  </div>
  );
};
