export type FilterValue = 'all' | 'active' | 'completed';

interface Props {
  current: FilterValue;
  onChange: (filter: FilterValue) => void;
}

const filters: { label: string; value: FilterValue }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
];

export function TodoFilter({ current, onChange }: Props) {
  return (
    <div className="todo-filter" role="group" aria-label="Filter todos">
      {filters.map(({ label, value }) => (
        <button
          key={value}
          className={`btn todo-filter__btn${current === value ? ' todo-filter__btn--active' : ''}`}
          onClick={() => onChange(value)}
          aria-pressed={current === value}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
