import React, { useState } from 'react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface Todo {
  id: string;
  content: string;
}

const api = "https://65c8837ea4fbc162e111d092.mockapi.io/";

const TodoComponent: React.FC = () => {
  const queryClient = useQueryClient();
  const [newTodoContent, setNewTodoContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const TodoQuery = useQuery<Todo[], Error>({
    queryKey: ["todos"],
    queryFn: () => axios.get(`${api}todos`).then(res => res.data),
  });

  const addTodoMutation = useMutation({
    mutationFn: (newTodo: { content: string }) => axios.post(`${api}todos`, newTodo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: (todoId: string) => axios.delete(`${api}todos/${todoId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: (todo: { id: string; content: string }) =>
      axios.put(`${api}todos/${todo.id}`, { content: todo.content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setEditingId(null);
    },
  });

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoContent.trim()) return;
    addTodoMutation.mutate({ content: newTodoContent });
    setNewTodoContent('');
  };

  const handleDeleteTodo = (todoId: string) => {
    deleteTodoMutation.mutate(todoId);
  };

  const handleEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditContent(todo.content);
  };

  const handleUpdate = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    updateTodoMutation.mutate({ id, content: editContent });
  };

  if (TodoQuery.isLoading) return <p>Loading...</p>;
  if (TodoQuery.isError) return <p>Error: {TodoQuery.error.message}</p>;

  return (
    <main className=' bg-gray-800 rounded-2xl p-6 min-h-screen w-[80%] m-auto'>
      <h1 className="text-3xl font-bold mb-8 text-white">Todo App</h1>
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
        <button type="submit" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2'>Add Todo</button>
      </form>
      <div className="flex justify-center">
        <div className=" xl:w-1/2 2xl:w-1/2 mt-6">
          {TodoQuery.data?.map(todo => (
            <div key={todo.id} className="flex justify-between items-center bg-white shadow-md rounded-lg p-4 my-2">
              {editingId === todo.id ? (
                <form onSubmit={(e) => handleUpdate(e, todo.id)} aria-labelledby={`editTodoLabel${todo.id}`} className="w-full">
                  <label htmlFor={`editInput${todo.id}`} className="sr-only">Edit Todo</label>
                  <input
                    id={`editInput${todo.id}`}
                    className='border-2 border-gray-300 rounded-lg w-full p-2'
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    aria-label={`Edit todo ${todo.content}`}
                  />
                  <button type="submit" className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded m-2 float-right'>Update</button>
                </form>
              ) : (
                <div className="flex-grow">
                  <span>{todo.content}</span>
                </div>
              )}
              {editingId !== todo.id && (
                <div>
                  <button type='button' onClick={() => handleEdit(todo)} className='bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded m-1'>Edit</button>
                  <button type='button' onClick={() => handleDeleteTodo(todo.id)} className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded m-1'>Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default TodoComponent;