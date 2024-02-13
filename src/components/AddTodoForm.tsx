import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const api = "https://65c8837ea4fbc162e111d092.mockapi.io/";

const AddTodoForm = () => {
  const [newTodoContent, setNewTodoContent] = useState('');
  const queryClient = useQueryClient();

  const addTodoMutation = useMutation({
    mutationFn: (newTodo: { content: string }) => axios.post(`${api}todos`, { ...newTodo, done: false }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoContent.trim()) return;
    addTodoMutation.mutate({ content: newTodoContent });
    setNewTodoContent('');
  };

  return (
    <form onSubmit={handleAddTodo} aria-labelledby="addTodoLabel" className="flex justify-center">
      <label id="addTodoLabel" className="sr-only">Add new todo</label>
      <input
        className='border-2 border-gray-300 m-2 p-2 rounded-lg w-full max-w-md'
        type="text"
        placeholder="Add new todo"
        value={newTodoContent}
        onChange={(e) => setNewTodoContent(e.target.value)}
        aria-label="Add new todo"
      />
      <button type="submit" className='bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded m-2'>Add Todo</button>
    </form>
  );
};

export default AddTodoForm;