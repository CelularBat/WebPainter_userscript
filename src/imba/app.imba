# fallbacks if those dont exist at time of initialisation
global.imba_state ??= {}; 
global.imba_prop ??= {}; 
global.imba_prop.DrawMode ??={}
global.imba_prop.DrawStyl ??={}


css .overlay
		pos:absolute top:0 zi:16000000 left:0 w:auto h:auto d:block bg:rgba(0,0,0,0.3) overflow:hidden
	&.transparent
		bg:rgba(0,0,0,0) pointer-events: none
	&.hidden
		visibility:hidden

css .overlay .notDragging
	o:0
css .overlay .hideEraser
	display:none

	# DrawMode = global.imba_prop.DrawMode
	# DrawColor = global.imba_prop.DrawStyle = {color, strokeWidth}
	# IsDrawingOn = global.imba_prop.IsDrawingOn	
	# global.imba_prop.IsLayerVisible

tag app-main	
	def drawErase e, path, ctx	
		ctx.globalCompositeOperation="destination-out"
		let cx = e.x0 + e.dx 
		let cy = e.y0 + e.dy
		let r = eraser_fi/2
		ctx.beginPath()
		ctx.ellipse(cx, cy,r,r,0,0,Math.PI*2 )
		ctx.fill()

		
		

	def drawPencil e, path, ctx
		
		path.lineTo(e.x, e.y)
		ctx.globalCompositeOperation="source-over"
		setDrawStyle ctx
		ctx.stroke(path)

	def drawRect e, path, ctx	
		drawDragMark e
		if e.ended?
			setDrawStyle ctx
			ctx.beginPath()
			ctx.rect(e.x0, e.y0,e.dx,e.dy )
			let option = global.imba_prop.DrawMode.option
			if option==="empty"
				ctx.stroke() 
			else 
				ctx.fill()

	def drawElipse e, path, ctx	
		drawDragMark e
		if e.ended?
			let rx = Math.abs(e.dx / 2)
			let ry = Math.abs(e.dy / 2)
			let cx = e.x0 + (e.dx / 2) 
			let cy = e.y0 + (e.dy / 2)
			setDrawStyle ctx
			ctx.beginPath()
			ctx.ellipse(cx, cy,rx,ry,0,0,Math.PI*2 )
			let option = global.imba_prop.DrawMode.option
			if option==="empty"
				ctx.stroke() 
			else 
				ctx.fill()	

	def drawDragMark e
		if e.ended?
			$dragMark.classList.add('notDragging')
			return
		if e.phase === "init"
			$dragMark.classList.remove('notDragging')
		dm_w = Math.floor(Math.abs(e.dx))
		dm_h = Math.floor(Math.abs(e.dy))
		dm_x = Math.floor(e.x0 + Math.min(e.dx,0))
		dm_y = Math.floor(e.y0 + Math.min(e.dy,0))

		

	def setDrawStyle ctx
		let color = global.imba_prop.DrawStyle.color
		ctx.globalCompositeOperation="source-over"
		ctx.strokeStyle = color
		ctx.fillStyle = color
		ctx.lineWidth = switch global.imba_prop.DrawStyle.strokeWidth
			when "tiny" then 1
			when "small" then 5
			when "med" then 10
			when "big" then 25
			when "huge" then 45

	def draw e
		let path = e.$path ||= new Path2D
		let ctx = $canvas.getContext('2d')

		let mode = global.imba_prop.DrawMode.mode
		if mode==="erase"
			drawErase e, path, ctx	
		elif mode==="pencil"
			drawPencil e, path, ctx	
		elif mode==="square"
			drawRect e, path, ctx	
		elif mode==="circle"
			drawElipse e, path, ctx	

	def handleEraser e
		
		if (global.imba_prop.DrawMode.mode !=="erase")
			return
		eraser_fi = switch global.imba_prop.DrawMode.option
			when "tiny" then 10
			when "small" then 50
			when "med" then 100
			when "big" then 250
			when "huge" then 450
		eraser_x = e.layerX - eraser_fi/2
		eraser_y = e.layerY - eraser_fi/2
		
		


	def render
		<self.overlay
			.transparent=(!global.imba_prop.IsDrawingOn)
			.hidden=(!global.imba_prop.IsLayerVisible)
		>			
			<div$dragMark [left:{dm_x}px top:{dm_y}px w:{dm_w}px h:{dm_h}px ]>
				css bg:blue3/10 bd:blue4 position:absolute pointer-events:none 	
			<div$eraser .hideEraser=(global.imba_prop.DrawMode.mode !=="erase") [left:{eraser_x}px top:{eraser_y}px w:{eraser_fi}px h:{eraser_fi}px]>
				css bg:white/10 bd:blue4 position:absolute pointer-events:none  border-radius: 50%

			<canvas$canvas
				id="WebPainter_canvas"
				width=document.documentElement.scrollWidth
				height=document.documentElement.scrollHeight
				@touch.fit(self)=draw
				@mousemove.fit(self)=handleEraser>
			

			

imba.mount <app-main>