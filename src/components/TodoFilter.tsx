import React from 'react';

interface Props {
  filter: string;
  setFilter: (filter: string) => void;
}

const TodoFilter: React.FC<Props> = ({ filter, setFilter }) => {
  return (
    <div className="flex justify-center gap-4 mb-4">
      <button
        className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        onClick={() => setFilter('all')}
      >
        All
      </button>
      <button
        type='button'
        className={`px-4 py-2 rounded ${filter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        onClick={() => setFilter('active')}
      >
        Active
      </button>
      <button
        type='button'
        className={`px-4 py-2 rounded ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        onClick={() => setFilter('completed')}
      >
        Completed
      </button>
    </div>
  );
};

export default TodoFilter;
