import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Define the API endpoint
const api = "https://65c8837ea4fbc162e111d092.mockapi.io/";

// Define the Todo interface
interface Todo {
  id: string;
  content: string;
  done: boolean;
}

// Define the TodoItemProps interface
interface TodoItemProps {
  todo: Todo;
  setEditingId: React.Dispatch<React.SetStateAction<string | null>>;
  setEditContent: React.Dispatch<React.SetStateAction<string>>;
  editingId: string | null;
  editContent: string;
  handleUpdate: (e: React.FormEvent, id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, setEditingId, setEditContent, editingId, editContent, handleUpdate }) => {
  const queryClient = useQueryClient();

  const deleteTodoMutation = useMutation({
    mutationFn: (todoId: string) => axios.delete(`${api}todos/${todoId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const handleDeleteTodo = (todoId: string) => {
    deleteTodoMutation.mutate(todoId);
  };

  const toggleDone = useMutation({
    mutationFn: (todo: Todo) => axios.put(`${api}todos/${todo.id}`, { ...todo, done: !todo.done }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return (
    <div className={`flex justify-between items-center bg-white shadow-md rounded-lg p-4 my-2 ${todo.done ? 'line-through' : ''}`}>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => toggleDone.mutate(todo)}
        className="m-2"
        aria-label='Toggle todo completion'
      />
      {editingId === todo.id ? (
        <form onSubmit={(e) => handleUpdate(e, todo.id)} className="w-full flex-grow">
          <label htmlFor=""></label>
          <input
            className='border-2 border-gray-300 rounded-lg w-full p-2'
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <button type="submit" className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded m-2 float-right'>Update</button>
        </form>
      ) : (
        <div className="flex-grow">
          <span>{todo.content}</span>
          <button type='button' onClick={() => { setEditingId(todo.id); setEditContent(todo.content); }} className='bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded m-1'>Edit</button>
          <button type='button' onClick={() => handleDeleteTodo(todo.id)} className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded m-1'>Delete</button>
        </div>
      )}
    </div>
  );
};

export default TodoItem;
