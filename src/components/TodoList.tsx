import React from 'react';
import TodoItem from './TodoItem';

const TodoList = ({ todos, setEditingId, setEditContent, editingId, editContent, handleUpdate }) => {
  return (
    <div className="flex justify-center">
      <div className="md:w-2/3 xl:w-1/2 2xl:w-1/2 mt-6">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            setEditingId={setEditingId}
            setEditContent={setEditContent}
            editingId={editingId}
            editContent={editContent}
            handleUpdate={handleUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default TodoList;