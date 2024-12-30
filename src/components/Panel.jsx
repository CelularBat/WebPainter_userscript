import React from 'react';
import { FaTrash, FaEraser, FaPencilAlt, FaRegSquare, FaRegCircle,
    FaPalette,FaGripVertical,FaPowerOff,FaEye,FaLowVision   } from 'react-icons/fa';
import './Panel.css';
import useStatePropImba from '../hooks/useStatePropImba.jsx'
import ColorPicker from './ColorPicker.tsx'

import classNames from 'classnames';

import pencil_Icon from '../assets/Pencil-SweezyCursors.ico';
import eraser_Icon from '../assets/Eraser-SweezyCursors.ico';




function Panel({}) {

    const [DrawColor,setDrawColor] = useStatePropImba("DrawColor","green");
    const [DrawMode,setDrawMode] = useStatePropImba("DrawMode","pencil");
    const [IsDrawingOn,setIsDrawingOn] = useStatePropImba('IsDrawingOn',false);
    const [IsLayerVisible,setIsLayerVisible] = useStatePropImba('IsLayerVisible',true);

    


    function handleClearCanvas() {
        const canvas = document.getElementById('WebPainter_canvas');
		const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }


    React.useEffect( ()=>{
      if(IsDrawingOn && IsLayerVisible){
        if (DrawMode === "erase"){ 
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


    const modeButtonsData=[
        {icon: <FaEraser/>, mode:"erase"},
        {icon: <FaPencilAlt/>, mode:"pencil"},
        {icon: <FaRegSquare/>, mode:"square"},
        {icon: <FaRegCircle/>, mode:"circle"}
    ];

    const modeButtonsRender = modeButtonsData.map((data,idx) =>{
        return (
            <button key={idx} name={data.mode} 
            title={`mode : ${data.mode}`}
            className={classNames("WebPainter--icon-btn",{ "mode-active": DrawMode === data.mode }, "mode-btn")} 
            onClick={()=>setDrawMode(data.mode)}
            >
                {data.icon}
            </button>
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
