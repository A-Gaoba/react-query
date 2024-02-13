import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import TodoFilter from './TodoFilter';
import AddTodoForm from './AddTodoForm';
import { Todo } from './types';

const api = "https://65c8837ea4fbc162e111d092.mockapi.io/";

const TodoComponent: React.FC = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [filter, setFilter] = useState('all');

  const TodoQuery = useQuery<Todo[], Error>({
    queryKey: ["todos"],
    queryFn: () => axios.get(`${api}todos`).then(res => res.data),
  });

  const [todos, setTodos] = useState<Todo[]>([]);
  useEffect(() => {
    if (TodoQuery.data) {
      const sortedTodos = [...TodoQuery.data].sort((a, b) => Number(a.done) - Number(b.done));
      setTodos(sortedTodos);
    }
  }, [TodoQuery.data]);

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.done;
      case 'completed':
        return todo.done;
      default:
        return true;
    }
  });

  const deleteTodoMutation = useMutation({
    mutationFn: (todoId: string) => axios.delete(`${api}todos/${todoId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: (todo: { id: string; content: string; done?: boolean }) =>
      axios.put(`${api}todos/${todo.id}`, todo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setEditingId(null);
    },
  });


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

  const toggleDone = (todo: Todo) => {
    updateTodoMutation.mutate({ ...todo, done: !todo.done });
  };

  if (TodoQuery.isLoading) return <p>Loading...</p>;
  if (TodoQuery.isError) return <p>Error: {TodoQuery.error.message}</p>;

  return (
    <motion.main
      className='bg-gray-800 rounded-2xl p-6 min-h-screen w-full md:w-3/4 lg:w-[60%] xl:mx-auto'
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { delay: 0.3, duration: 0.5 } }
      }}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 lg:mb-8 text-white">Todo App</h1>
      <TodoFilter filter={filter} setFilter={setFilter} />
      <AddTodoForm />
      <div className="flex justify-center">
        <div className="w-full sm:w-2/3 md:w-2/3 lg:w-1/2 xl:w-1/2 mt-6">
          {filteredTodos.map((todo, index) => (
            <motion.div
              key={todo.id}
              className={`flex justify-between items-center bg-white shadow-md rounded-lg p-4 my-2 ${todo.done ? 'line-through' : ''}`}
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1, transition: { delay: index * 0.1, duration: 0.4 } }
              }}
              initial="hidden"
              animate="visible"
            >
              <input
                name='checkbox'
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleDone(todo)}
                className="m-2"
                aria-label='check todo'
              />
              {editingId === todo.id ? (
                <form onSubmit={(e) => handleUpdate(e, todo.id)} className="w-full flex-grow">
                  <input
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
                  <button onClick={() => handleEdit(todo)} className='bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded m-1'>Edit</button>
                  <button onClick={() => handleDeleteTodo(todo.id)} className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded m-1'>Delete</button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.main>
  );  
};

export default TodoComponent;
