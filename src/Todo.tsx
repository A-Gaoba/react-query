import React, { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';

interface Todo {
  id: string;
  content: string;
}

const api = "https://65c8837ea4fbc162e111d092.mockapi.io/";

function TodoList() {
  const queryClient = useQueryClient();
  const [newTodoContent, setNewTodoContent] = useState('');

  const todoQuery = useQuery<Todo[], Error>({
    queryKey: ["todos"],
    queryFn: () => axios.get(`${api}todos`).then(res => res.data),
  });

  const addTodoMutation = useMutation({
    mutationFn: (addNewTodo: { content: string }) => axios.post(`${api}todos`, addNewTodo).then(res=> res.data),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["todos"]}),
  });

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoContent.trim()) return;
    addTodoMutation.mutate({ content: newTodoContent });
    setNewTodoContent('');
  };

  if (todoQuery.isLoading) return <p>Loading...</p>;
  if (todoQuery.isError) return <p>Error: {todoQuery.error?.message}</p>;

  return (
    <div>
      <h1 className='font-bold text-xlg'>Todo List</h1>
      <form onSubmit={handleAddTodo}>
        <label htmlFor="addTodoLabel" className="sr-only">Add new todo</label>
        <input
          type="text"
          name='todo'
          value={newTodoContent}
          onChange={(e) => setNewTodoContent(e.target.value)}
          placeholder='Write todo here'
          className='border-2 m-2 p-2'
        />
        <button type="submit" className='border-2 m-2 p-2'>Add Todo</button>
      </form>

      <div>
        {todoQuery.data?.map((todo: Todo) => (
          <div key={todo.id} className='flex justify-between'>
            <p>{todo.content}</p>
            <button type="button" className='border-2 m-2 p-2'>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TodoList;
