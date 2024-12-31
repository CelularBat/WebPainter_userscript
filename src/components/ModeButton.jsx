import React from 'react';
import classNames from 'classnames';

// data: {icon: <FaRegSquare/>, mode:"square", options:[{name:"fill",label:<h1>fill</h1>},{name:'empty',label:"full"}]}

function ModeButton({data,setDrawMode,DrawMode,
    children,className,...rest}) {

    const [Option,setOption] = React.useState({
        name: data?.options[0].name || null,
        label:  data?.options[0].label || null,
    });
    const [ShowList,setShowList] = React.useState({show: false, x:0, y:0});

    function handleShowList(e){
        let y = e.clientY + 30;
       // if (y < 0) y = e.clientY + 30;
        setShowList({
            show: true,
            x: e.clientX - 10,
            y: y
        })
    }

    function handleClick(e){
        handleShowList(e);
        setDrawMode({mode: data.mode, option:Option.name})
    }


    const optionsList = data.options.map((option,idx) => { 
    const isOptionActive = Option.name === option.name;  
      return(<button key={idx} 
        className={classNames("WebPainter--option-btn",{"active": isOptionActive})}
        onClick={ ()=>{
            setOption({name: option.name, label: option.label});
            setDrawMode((prev)=>({...prev, option: option.name}));
            setShowList(false); 
        }}
        >
        {option.label}
      </button>); 
    })
    
    const isModeActive = DrawMode.mode === data.mode;
  
    return (
        <>
        <button {...rest} 
            className={classNames(className,"WebPainter--mode-btn",{"active": isModeActive})}
            name={data.mode} 
            title={`mode : ${data.mode}`}
            onClick={handleClick}>
                {data.iconReplace? Option.label: data.icon}
                {children}
        </button>

        {   ShowList.show && isModeActive &&
            <div className='WebPainter--mode-options'
            style={{left:ShowList.x,top:ShowList.y,position:'fixed'}}
            onMouseLeave={()=>setShowList(false)}>
                {optionsList}
            </div>

        }
       </>
    );
}

export default ModeButton;