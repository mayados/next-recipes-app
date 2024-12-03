"use client";

import { Search } from 'lucide-react';
// useSearchParams est un hook
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function SearchInput({placeholder}: {placeholder: string}) {

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const {replace} = useRouter();

  // Get the users' input
  function handleSearch(term: string){
    // Is an API providing utility methods about thee URL query parameters
    const params = new URLSearchParams(searchParams);
    // We set the params string based on user's input
    if(term) {
      params.set('query',term)
    }else{
      params.delete('qery')
    }
    
    // ${pathname} = the current path
    // params.toString() = translate the user's input into a URL - friendly format
    replace(`${pathname}?${params.toString()}`);

  }

  return (

    <>
        <section>
          <div className='relative inline-flex'>
            <input 
            className='lg:w-[50vh] h-[2rem] rounded-md pl-[3rem] bg-slate-800'
              type="text" 
              placeholder={placeholder}
              // Each time the input's value is changing we call handleSearch
              onChange={(e) => {
                handleSearch(e.target.value)
              }}
              // defaultValue is used because the input manages its own state (cause we are saving the search query to the URL instead of state). On the other case, value would have been used
              defaultValue={searchParams.get('query')?.toString()}

            />
            <Search className='absolute left-3 top-1' />
          </div>
        </section>

    </>

  )
}
