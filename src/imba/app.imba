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


	
	def drawErase ctx
		ctx.globalCompositeOperation="destination-out"
		ctx.lineWidth = 30

	def drawPencil ctx
			ctx.lineWidth = 5
			ctx.globalCompositeOperation="source-over"
			
	def draw e
		let path = e.$path ||= new Path2D
		path.lineTo(e.x, e.y)
		let ctx = $canvas.getContext('2d')
		ctx.strokeStyle = global.imba_prop.DrawColor

		if global.imba_prop.DrawMode==="erase"
			drawErase ctx
		else
			drawPencil ctx
			
		ctx.stroke(path)

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