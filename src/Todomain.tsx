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
    <>
      <h1 className="text-3xl font-bold mb-8">Todo App</h1>
      <form onSubmit={handleAddTodo} aria-labelledby="addTodoLabel">
        <label id="addTodoLabel" className="sr-only">Add new todo</label>
        <input
          className='border-2 m-2 p-2'
          type="text"
          placeholder="Add new todo"
          value={newTodoContent}
          onChange={(e) => setNewTodoContent(e.target.value)}
          aria-label="Add new todo"
        />
        <button type="submit" className='border-2 m-2 p-2'>Add Todo</button>
      </form>
      <div>
        {TodoQuery.data?.map(todo => (
          <div key={todo.id} className="flex justify-between items-center">
            {editingId === todo.id ? (
              <form onSubmit={(e) => handleUpdate(e, todo.id)} aria-labelledby={`editTodoLabel${todo.id}`}>
                <label htmlFor={`editInput${todo.id}`} className="sr-only">Edit Todo</label>
                <input
                  id={`editInput${todo.id}`}
                  className='border-2 m-2 p-2'
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  aria-label={`Edit todo ${todo.content}`}
                />
                <button type="submit" className='border-2 m-2 p-2'>Update</button>
              </form>
            ) : (
              <>
                <span>{todo.content}</span>
                <button onClick={() => handleEdit(todo)} className='border-2 m-2 p-2'>Edit</button>
              </>
            )}
            <button onClick={() => handleDeleteTodo(todo.id)} className='border-2 m-2 p-2'>Delete</button>
          </div>
        ))}
      </div>
    </>
  );
};

export default TodoComponent;