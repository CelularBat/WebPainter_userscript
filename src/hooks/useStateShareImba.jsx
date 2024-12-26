// useState ,which state is shared between React and Imba. Works in both directions ( React <=> Imba). 
// If it's changed in Imba it's changed in React
// In Imba get or set it by global.imba_state.imbaStateName
/* usage Example
   --- in App.jsx ---

    const [count,setCount] = useStateShareImba("count",0);
    (...)
    render(
        <button onClick={ ()=>setCount((count) => count + 1)}> count is {count} </button>
    )

   --- in app.imba ---
    global.imba_state ??= {}; #this fallback initialisation is necessary, becase React may act after Imba 

    tag app
        def render
            <self @click=(global.imba_state.counter++)> "Counter Value in Imba: {global.imba_state.counter}"
*/

import React from 'react';

function useStateShareImba(imbaStateName,defaultValue) {
    const [State,setState] = React.useState(globalThis?.imba_state[imbaStateName] || defaultValue);
   
        // Initialize globalThis.imba_state object
       React.useEffect( ()=>{
           if (!globalThis.___imba_state_isProxified){
            globalThis.___imba_state_isProxified = true;
            globalThis.imba_state = new Proxy({},{

                    set(target, key, value) {
                        // Check if the new value is different from the old value
                        if (target[key] !== value) {
                            target[key] = value;
                            // call callback function if it's set
                            if (typeof target[`__${key}_onChange`] === "function") {
                                target[`__${key}_onChange`](value); 
                            }  
                        }
                        return true; 
                      }
                })
           }
           // We don't clean it, because it can be re-used for other states.
       },[]);

       // Initialize middleware for that particular key (state)
       React.useEffect( ()=>{
        if (!globalThis.imba_state[imbaStateName]) globalThis.imba_state[imbaStateName] = State;
        globalThis.imba_state[`__${imbaStateName}_onChange`] = (value)=>{
            setState(value);
        }
        return ()=>{
            globalThis.imba_state[`__${imbaStateName}_onChange`] = null;
        }
       },[]);
   
       React.useEffect( ()=>{
           globalThis.imba_state[imbaStateName] = State;
           globalThis.imba.commit();
       },[State]);
   
       return (
           [State,setState]
       );
}

export default useStateShareImba;