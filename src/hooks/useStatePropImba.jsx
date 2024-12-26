// useState ,which state is automatically sent as prop to imba. Works in one direction ( React => Imba)
// In Imba get it by global.imba_prop.imbaPropName
/* usage Example
   --- in App.jsx ---

      const [propText,setPropText] = useStatePropImba("propText","Hello from React!");

   --- in app.imba ---
    global.imba_prop ??= {}; #this fallback initialisation is necessary, becase React may act after Imba 

    tag app
        def render
            <self> "propText value in Inba: {global.imba_prop.propText}"
*/

import React from "react";

function useStatePropImba(imbaPropName,defaultValue) {

    const [State,setState] = React.useState(defaultValue);

    React.useEffect( ()=>{
        if (!globalThis.imba_prop) globalThis.imba_prop = {};
    },[]);

    React.useEffect( ()=>{
        globalThis.imba_prop[imbaPropName] = State;
        globalThis.imba.commit();
    },[State]);

    return (
        [State,setState]
    );
}

export default useStatePropImba;