import React from 'react';
import { FaTrash, FaEraser, FaPencilAlt, FaRegSquare, FaRegCircle,
    FaPalette,FaGripVertical,FaPowerOff,FaEye,FaLowVision   } from 'react-icons/fa';
import './Panel.css';
import useStatePropImba from '../hooks/useStatePropImba.jsx'
import ColorPicker from './ColorPicker.tsx'
import classNames from 'classnames';
import pencil_Icon from '../assets/Pencil-SweezyCursors.ico';
import eraser_Icon from '../assets/Eraser-SweezyCursors.ico'

const modeButtonsData=[
    {icon: <FaEraser/>, mode:"erase"},
    {icon: <FaPencilAlt/>, mode:"pencil"},
    {icon: <FaRegSquare/>, mode:"square"},
    {icon: <FaRegCircle/>, mode:"circle"}
]

function Panel({}) {

    const [DrawColor,setDrawColor] = useStatePropImba("DrawColor","green");
    const [DrawMode,setDrawMode] = useStatePropImba("DrawMode","pencil");
    const [IsDrawingOn,setIsDrawingOn] = useStatePropImba('IsDrawingOn',false);
    const [IsLayerVisible,setIsLayerVisible] = useStatePropImba('IsLayerVisible',true);

    const [ShowColorPicker,setShowColorPicker] = React.useState({show: false, x:0, y:0});

    const [FormPos,setFormPos] = React.useState({isDragged: false, x: 10, y:10});
    
    function handleClickShowColorPicker(e){
        setShowColorPicker({
            show: true,
            x: e.clientX - 90,
            y: e.clientY - 320
        })
    }

    function clearCanvas() {
        const canvas = document.getElementById('WebPainter_canvas');
		const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function handleSwitchColor(color){
        setDrawColor("#"+color.hex)
        setShowColorPicker(false);
    }

    function handleDraging(e){

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

    const modeButtonsRender = modeButtonsData.map((data,idx) =>{
        return (
            <button key={idx} name={data.mode} 
            title={`mode : ${data.mode}`}
            className={classNames("icon-btn",{ "mode-active": DrawMode === data.mode }, "mode-btn")} 
            onClick={()=>setDrawMode(data.mode)}
            >
                {data.icon}
            </button>
        )
    })
    return (
        <>
        <div className='Panel'>
            <button id="trash-btn" className="icon-btn" style={{  color: "red", marginRight:'10px' }}
            title={"clear layer"}
            onClick={clearCanvas}
            >
                <FaTrash />
            </button>

            {modeButtonsRender}
           
            <button id="color-btn" className="icon-btn" style={{  color: DrawColor }} 
            title={"pick color"}
            onClick={handleClickShowColorPicker}
            >
                <FaPalette  />
            </button>

            <button id="turn-btn" className="icon-btn" 
            style={{  color: IsLayerVisible? "green" : "gray", marginLeft: "15px" }}
            title={IsLayerVisible? "hide canvas" : "show canvas"}
            onClick={()=>setIsLayerVisible(prev=>!prev)}
            >
                {IsLayerVisible? <FaEye /> : <FaLowVision />}
            </button>

            <button id="turn-btn" className="icon-btn" 
            style={{  color: IsDrawingOn? "green" : "red", marginLeft: "5px", marginRight: "10px" }}
            title={IsDrawingOn? "turn off" : "turn on"}
            onClick={()=>setIsDrawingOn(prev=>!prev)}
            >
                <FaPowerOff  />
            </button>

            <div className="drag-handle" style={{  marginLeft: "10px",color: 'dimgray', cursor:'move' }}
            onMouseDown={handleDraging}>
                    <FaGripVertical />
            </div>
            
        </div>

        {ShowColorPicker.show && <div style={{position:'fixed',left:ShowColorPicker.x,top:ShowColorPicker.y,zIndex:999}}>
            <ColorPicker handleClick={handleSwitchColor} default_value={DrawColor}/>
        </div>}
        </>
    );
}

export default Panel;
