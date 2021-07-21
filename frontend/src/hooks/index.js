import { useState } from "react";

export function useField(type) {
  const [value, setValue] = useState('');

  const onChange = (event) => {
    setValue(event.target.value);
  }

  const reset = () => {
    setValue('');
  }

  const props = {
    onChange, value, type
  }

  return {
    value,
    reset,
    setValue,
    props,
  }

}