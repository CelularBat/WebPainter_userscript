import React from 'react';
import { FaTrash, FaEraser, FaPencilAlt, FaRegSquare, FaRegCircle,
    FaPalette,FaGripVertical,FaPowerOff,FaEye,FaLowVision,FaSquare,FaCircle   } from 'react-icons/fa';
import './Panel.css';
import useStatePropImba from '../hooks/useStatePropImba.jsx'
import ColorPicker from './ColorPicker.tsx'

import classNames from 'classnames';

import pencil_Icon from '../assets/Pencil-SweezyCursors.ico';
import eraser_Icon from '../assets/Eraser-SweezyCursors.ico';
import ModeButton from './ModeButton.jsx';





function Panel({}) {

    const [DrawColor,setDrawColor] = useStatePropImba("DrawColor","green");
    const [DrawMode,setDrawMode] = useStatePropImba("DrawMode",{mode:"pencil",option:'small'});
    const [IsDrawingOn,setIsDrawingOn] = useStatePropImba('IsDrawingOn',false);
    const [IsLayerVisible,setIsLayerVisible] = useStatePropImba('IsLayerVisible',true);

    


    function handleClearCanvas() {
        const canvas = document.getElementById('WebPainter_canvas');
		const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }


    React.useEffect( ()=>{
      if(IsDrawingOn && IsLayerVisible){
        if (DrawMode.mode === "erase"){ 
             document.documentElement.style.cursor = `url("${eraser_Icon}"),auto`; } 
        else { 
            document.documentElement.style.cursor = `url("${pencil_Icon}"),auto`;}
      }
      else { 
        document.documentElement.style.cursor = ""; }
    },[IsDrawingOn,DrawMode,IsLayerVisible]);


    return (
        <PanelRender {...{
            DrawColor,setDrawColor
            ,DrawMode,setDrawMode
            ,IsDrawingOn,setIsDrawingOn
            ,IsLayerVisible,setIsLayerVisible
            ,handleClearCanvas
        }}/>
    );
}

export default Panel;

///////////////////////////////////////////////
/// PanelRender
///////////////////////////////////////////////


function PanelRender({
    DrawColor,setDrawColor
    ,DrawMode,setDrawMode
    ,IsDrawingOn,setIsDrawingOn
    ,IsLayerVisible,setIsLayerVisible
    ,handleClearCanvas
}) {

    const [ShowColorPicker,setShowColorPicker] = React.useState({show: false, x:0, y:0});
    const [FormPos,setFormPos] = React.useState({ x: 10, y:10});
    const [IsDraggingPanel,setIsDraggingPanel] = React.useState(false);
    // ColorPicker section
    function handleClickShowColorPicker(e){
        let y = e.clientY - 320;
        if (y < 0) y = e.clientY + 30;

        setShowColorPicker({
            show: true,
            x: e.clientX - 140,
            y: y
        })
    }

    function handleSwitchColor(color){
        setDrawColor("#"+color.hex)
        setShowColorPicker(false);
    }
    //Dragging section
    const panelDiv_Ref = React.useRef(null); 
    const dragHandle_Ref = React.useRef(null); 

    const draggingListener = React.useCallback((e)=>{
        
        const parentRect = panelDiv_Ref.current?.getBoundingClientRect();
        const handleRect = dragHandle_Ref.current?.getBoundingClientRect();
        const offsetX = handleRect.left - parentRect.left + 5;
        const offsetY = handleRect.top - parentRect.top + 5;

        setFormPos({x: e.clientX - offsetX, y: e.clientY - offsetY});
       
    },[])

    React.useEffect( ()=>{
        if (IsDraggingPanel){
           document.addEventListener('mousemove',draggingListener);
        } 
        else{
            document.removeEventListener('mousemove',draggingListener);
        }

        return ()=>{ console.log('cleanup');
            document.removeEventListener('mousemove',draggingListener);
        }
    },[IsDraggingPanel]);
    // mode buttons section

    const modeButtonsData=[
        {icon: <FaEraser/>, mode:"erase", iconReplace:false,
            options:[{name:'small',label:'small'},{name:'med',label:'med'},{name:'big',label:'big'},{name:'huge',label:'huge'}]},
        {icon: <FaPencilAlt/>, mode:"pencil",iconReplace:false,
            options:[{name:'tiny',label:'tiny'},{name:'small',label:'small'},{name:'med',label:'med'},{name:'big',label:'big'},{name:'huge',label:'huge'}]
        },
        {icon: <FaRegSquare/>, mode:"square",iconReplace:true,
            options:[{name:"empty",label:<FaRegSquare/>},{name:'full',label:<FaSquare />}]
        },
        {icon: <FaRegCircle/>, mode:"circle",iconReplace:true,
            options:[{name:"empty",label:<FaRegCircle/>},{name:'full',label:<FaCircle />}]
        }
    ];

    const modeButtonsRender = modeButtonsData.map((data,idx) =>{
        return (
            <ModeButton key={idx} 
            className={"WebPainter--icon-btn"} 
            {...{data,setDrawMode,DrawMode}}
            >
            </ModeButton>
        )
    })


    return (
        <>
        <div className='WebPainter--Panel' ref={panelDiv_Ref}
        style ={{left: `${FormPos.x}px` , top:`${FormPos.y}px` }} >
            <button id="WebPainter--trash-btn" 
            className={classNames("WebPainter--icon-btn",{'WebPainter--displayNone':!IsLayerVisible})}
            style={{  color: "red", marginRight:'10px' }}
            title={"clear layer"}
            onClick={handleClearCanvas}
            >
                <FaTrash />
            </button>

            {IsLayerVisible && modeButtonsRender}
           
            <button id="WebPainter--color-btn" 
            className={classNames("WebPainter--icon-btn",{'WebPainter--displayNone':!IsLayerVisible})}
            style={{  color: DrawColor }} 
            title={"pick color"}
            onClick={handleClickShowColorPicker}
            >
                <FaPalette  />
            </button>

            <button id="WebPainter--hide-btn" 
            className="WebPainter--icon-btn" 
            style={{  color: IsLayerVisible? "green" : "gray", marginLeft: "15px" }}
            title={IsLayerVisible? "hide" : "show"}
            onClick={()=>setIsLayerVisible(prev=>!prev)}
            >
                {IsLayerVisible? <FaEye /> : <FaLowVision />}
            </button>

            <button id="WebPainter--turn-btn" 
            className={classNames("WebPainter--icon-btn",{'WebPainter--displayNone':!IsLayerVisible})}
            style={{  color: IsDrawingOn? "green" : "red", marginLeft: "5px", marginRight: "10px" }}
            title={IsDrawingOn? "drawing off" : "drawing on"}
            onClick={()=>setIsDrawingOn(prev=>!prev)}
            >
                <FaPowerOff  />
            </button>

            <div ref={dragHandle_Ref}
            className="WebPainter--drag-handle" 
            style={{  marginLeft: "10px",color: 'dimgray', cursor:'move' }}
            onMouseDown={()=>setIsDraggingPanel(true)} 
            onMouseUp={()=>setIsDraggingPanel(false)}
            >
                    <FaGripVertical />
            </div>
            
        </div>

        {ShowColorPicker.show && 
        <div className="WebPainter--ColorPicker"
        style={{left:ShowColorPicker.x,top:ShowColorPicker.y}}>
            <ColorPicker handleClick={handleSwitchColor} default_value={DrawColor}/>
        </div>}
        </>
    );
}
