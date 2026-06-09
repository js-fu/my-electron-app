import { useState, useRef } from 'react';

interface Props {
  onAdd: (title: string) => void;
}

export function TodoInput({ onAdd }: Props) {
  const [value, setValue] = useState('');
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const invalid = touched && value.trim() === '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!value.trim()) return;
    onAdd(value.trim());
    setValue('');
    setTouched(false);
    inputRef.current?.focus();
  };

  return (
    <form className="todo-input-form" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        className={`todo-input${invalid ? ' todo-input--error' : ''}`}
        type="text"
        placeholder="What needs to be done?"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setTouched(true)}
        aria-label="New todo title"
      />
      <button type="submit" className="btn btn-primary">Add</button>
      {invalid && (
        <span className="todo-input-hint" role="alert">
          Please enter a title.
        </span>
      )}
    </form>
  );
}
