import { Input } from '@nextui-org/react';
import { useState, useMemo } from 'react';

export const StudentAutocomplete = ({ 
  options,
  name, 
} : {
  options: any;
  name: string;
}) => {
  const [query, setQuery] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);

  const handleInputChange = (e: any) => {
    setQuery(e.target.value);
  };

  useMemo(() => {
    if (query) {
      const filtered = options.filter((option: any) =>
        option.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions([]);
    }
  }, [query, options]);

  return (
    <div className={`relative w-full flex flex-col gap-8 `}>
      <Input
        type="text"
        value={query}
        name={name}
        onChange={handleInputChange}
        // className="w-full p-2 border border-gray-300 bg-zinc-100 rounded-xl"
        placeholder="Search..."
        autoComplete='off'
        className='h-16 z-auto'
      />

      {filteredOptions.length > 0 && (
        <ul className="absolute left-0 right-0 mt-12 bg-zinc-50 border border-zinc-100 rounded-lg shadow-lg h-64 overflow-y-auto z-10"
        >
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => setQuery(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
