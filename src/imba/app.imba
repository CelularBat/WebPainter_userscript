global.imba_state ??= {}; 
global.imba_prop ??= {}; 


# Challenge:
# Convert the following HTML to use Imba's HTML syntax
# Nest your solution below the <div> tag

# <details class="imba-details">
#     <summary>Imba</summary>
#     <p>A cool programming language</p>
#     <a href="https://imba.io">Learn More</a>
# </details>

# const dpr = window.devicePixelRatio;

css .overlay
		pos:absolute top:0 zi:16000000 left:0 w:auto h:auto d:block bg:rgba(0,0,0,0.3)
	&.transparent
		bg:rgba(0,0,0,0) pointer-events: none
	&.hidden
		visibility:hidden

	


tag app-main
	# DrawMode = global.imba_prop.DrawMode
	# DrawColor = global.imba_prop.DrawColor
	# IsDrawingOn = global.imba_prop.IsDrawingOn
	


	
	def drawErase e
		let path = e.$path ||= new Path2D
		let ctx = $canvas.getContext('2d')
		path.lineTo(e.x, e.y)

		ctx.globalCompositeOperation="destination-out"
		ctx.lineWidth = switch global.imba_prop.DrawMode.option
			when "tiny" then 1
			when "small" then 5
			when "med" then 10
			when "big" then 25
			when "huge" then 45
		ctx.stroke(path)

	def drawPencil e
		let path = e.$path ||= new Path2D
		let ctx = $canvas.getContext('2d')
		path.lineTo(e.x, e.y)

		ctx.globalCompositeOperation="source-over"
		ctx.strokeStyle = global.imba_prop.DrawColor
		ctx.lineWidth = switch global.imba_prop.DrawMode.option
			when "tiny" then 1
			when "small" then 5
			when "med" then 10
			when "big" then 25
			when "huge" then 45
		ctx.stroke(path)

	def drawRect e
		if e.ended?
			let ctx = $canvas.getContext('2d')
			ctx.beginPath()
			ctx.rect(e.x0, e.y0,e.dx,e.dy )
			let option = global.imba_prop.DrawMode.option
			let color = global.imba_prop.DrawColor
			if option==="empty"
				ctx.strokeStyle = color
				ctx.stroke() 
			else 
				ctx.fillStyle = color
				ctx.fill()

	def drawElipse e
		if e.ended?
			let ctx = $canvas.getContext('2d')
			let rx = Math.abs(e.dx / 2)
			let ry = Math.abs(e.dy / 2)
			let cx = e.x0 + (e.dx / 2) 
			let cy = e.y0 + (e.dy / 2)
			ctx.beginPath()
			ctx.ellipse(cx, cy,rx,ry,0,0,Math.PI*2 )
			let option = global.imba_prop.DrawMode.option
			let color = global.imba_prop.DrawColor
			if option==="empty"
				ctx.strokeStyle = color
				ctx.stroke() 
			else 
				ctx.fillStyle = color
				ctx.fill()		

	def draw e
		let mode = global.imba_prop.DrawMode.mode
		if mode==="erase"
			drawErase e
		elif mode==="pencil"
			drawPencil e	
		elif mode==="square"
			drawRect e
		elif mode==="circle"
			drawElipse e


	def render
		<self.overlay
			.transparent=(!global.imba_prop.IsDrawingOn)
			.hidden=(!global.imba_prop.IsLayerVisible)
		>
			<canvas$canvas
				id="WebPainter_canvas"
				width=document.documentElement.scrollWidth
				height=document.documentElement.scrollHeight
				@touch.fit(self)=draw>

imba.mount <app-main>