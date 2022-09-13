

function main() {

    const app = new PIXI.Application({
        width: window.innerWidth - 40,
        height: window.innerHeight - 40,
        backgroundColor: 0x1099bb,
        resolution: window.devicePixelRatio || 1,
        autoDensity: false,
        antialias: false
    });

    

    let isPainting = 0;
    let selectedTexture = "";
    const tilesContainer = generateTilesContainer(app);
    const uiContainer = generateUIContainer(app);
    generateUI(app, uiContainer, tilesContainer);
    let gridWidth = 30;
    let gridHeight = 30;
    generateTiles(app, tilesContainer, gridWidth, gridHeight, selectedTexture, isPainting);
    document.body.appendChild(app.view);

}


function generateTilesContainer(app) {
    const tilesContainer = new PIXI.Container();
    tilesContainer.interactive = true;
    tilesContainer.x = app.screen.width / 2;
    tilesContainer.y = app.screen.height / 2;
    tilesContainer.pivot.x = tilesContainer.width / 2;
    tilesContainer.pivot.y = tilesContainer.height / 2;
    tilesContainer.scale.set(0.25);
    // tilesContainer
    //     .on('pointerdown', onDragStart)
    //     .on('pointerup', onDragEnd)
    //     .on('pointerupoutside', onDragEnd)
    //     .on('pointermove', onDragMove)
    //     // tilesContainer.addEventListener('wheel', onWheel);
    app.stage.addChild(tilesContainer);
    return tilesContainer;
}


function generateUIContainer(app) {

    const uiContainer = new PIXI.Container();

    uiContainer.interactive = true;
    uiContainer.zIndex = 1;

    app.stage.addChild(uiContainer);

    return uiContainer;
}


function generateTiles(app, tilesContainer, gridWidth, gridHeight, selectedTexture, isPainting) {



    // Create a new texture
    const grassTexture = PIXI.Texture.from('assets/tiles/grass.png');
    const waterTexture = PIXI.Texture.from('assets/tiles/water.png');

    selectedTexture = waterTexture;



    for (let i = -gridWidth / 2; i < gridWidth / 2; i++) {
        for (let j = -gridHeight / 2; j < gridHeight / 2; j++) {

            const tile = new PIXI.Sprite(grassTexture);
            tile.anchor.set(0);
            tile.x = (i % gridWidth) * 32;
            tile.y = (j % gridHeight) * 32;
            tile.interactive = true;
            tile.buttonMode = true;
            tile.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
            tile.on('pointerdown', () => {
                isPainting = 1;
                startPaint(app, tile, selectedTexture, tilesContainer, isPainting);
            });
            tile.on('pointerup', () => {
                isPainting = 0;
            });
            tile.on('pointerover', () => {
                onPointerOver(app, tile, selectedTexture, tilesContainer, isPainting)
            });
            tile.on('pointerout', () => {
                onPointerOut(app, tile, selectedTexture, tilesContainer, isPainting)
            })
            tilesContainer.addChild(tile);
        }
    }
}


function startPaint(app, tile, selectedTexture, tilesContainer, isPainting) {

    isPainting = 1;

    if (tile.texture != selectedTexture) {
        tile.texture = selectedTexture;
        tile.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    } else {
        // tile.texture = texturesArr[0];
        // tile.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    }

}


function stopPaint(isPainting) {
    isPainting = 0;
}


function onPointerOver(app, tile, selectedTexture, tilesContainer, isPainting) {
    console.log(`isPainting: ${isPainting}`)
    tile.tint = 0x666666;
    if (isPainting == 1) {
        tile.texture = selectedTexture;
        tile.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    }
}


function onPointerOut(app, tile, selectedTexture, tilesContainer, isPainting) {
    tile.tint = 0xFFFFFF;
}


function generateUI(app, uiContainer, tilesContainer) {
    const zoomControls = generateZoomControls(app, tilesContainer);
    const panControl = generatePanControl(app, uiContainer, tilesContainer);
    const tileSelector = generateTileSelector(app, uiContainer, tilesContainer);
    uiContainer.addChild(zoomControls.graphics);
    uiContainer.addChild(zoomControls.zoomInButton);
    uiContainer.addChild(zoomControls.zoomOutButton);
    uiContainer.addChild(panControl);
    uiContainer.addChild(tileSelector);
}


function generateZoomControls(app, tilesContainer) {
    const graphics = new PIXI.Graphics();
    graphics.lineStyle(0); // no outline
    graphics.beginFill(0xFFFFFF, 1);
    graphics.drawRect(app.screen.width * 0.8815, app.screen.height * 0.05, 48, 24);
    graphics.endFill();


    const zoomOutTextture = PIXI.Texture.from('assets/ui/minus-square.svg');
    const zoomInTextture = PIXI.Texture.from('assets/ui/plus-square.svg');
    const zoomButtonRes = 24;

    const zoomInButton = new PIXI.Sprite(zoomInTextture);
    const zoomOutButton = new PIXI.Sprite(zoomOutTextture);

    zoomInButton.interactive = true;
    zoomOutButton.interactive = true;

    zoomInButton.on('pointerdown', e => { zoomIn(tilesContainer) })
    zoomOutButton.on('pointerdown', e => { zoomOut(tilesContainer) })

    zoomInButton.x = app.screen.width * 0.9;
    zoomInButton.y = app.screen.height * 0.05;

    zoomOutButton.x = zoomInButton.x - zoomButtonRes;
    zoomOutButton.y = app.screen.height * 0.05;

    return { zoomInButton, zoomOutButton, graphics };
}


function generatePanControl(app, uiContainer, tilesContainer) {

    const panControlContainer = new PIXI.Container();
    const graphicsOuter = new PIXI.Graphics();
    const graphicsInner = new PIXI.Graphics();
    // Circle
    graphicsOuter.lineStyle(0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
    graphicsOuter.beginFill(0x333333, 1);
    graphicsOuter.drawCircle(app.screen.width * 0.9, app.screen.height * 0.9, 50);
    graphicsOuter.endFill();

    // Circle + line style 1
    graphicsInner.lineStyle(2, 0xFEEB77, 1);
    graphicsInner.beginFill(0x1050bb, 1);
    graphicsInner.drawCircle(app.screen.width * 0.9, app.screen.height * 0.9, 20);
    graphicsInner.interactive = true;
    graphicsInner.buttonMode = true;
    graphicsInner.endFill();
    //graphicsInner.on('pointerdown', e => {onPointerOver(graphicsInner)});
    //graphicsInner.on('pointerup', e => {onPointerOut(graphicsInner)});
    graphicsInner.on('pointerdown', onDragStart);
    graphicsInner.on('pointerup', onDragEnd);
    graphicsInner.on('pointerupoutside', onDragEnd);
    graphicsInner.on('pointermove', onDragMove);

    panControlContainer.addChild(graphicsOuter);
    panControlContainer.addChild(graphicsInner);

    uiContainer.addChild(panControlContainer);

    return panControlContainer;
}


function generateTileSelector(app, uiContainer, tilesContainer) {
    const tileSelectorContainer = new PIXI.Container();
    tileSelectorContainer.x = app.screen.width * 0.5;
    tileSelectorContainer.y = app.screen.height * 0.5;
    const grassTexture = PIXI.Texture.from('assets/tiles/grass.png');
    const waterTexture = PIXI.Texture.from('assets/tiles/water.png');

    const tiles = [grassTexture, waterTexture];

    tiles.forEach(t => {
        s = new PIXI.Sprite(t);
        s.anchor.set(0);
        s.x = tileSelectorContainer.x;
        s.y = tileSelectorContainer.y;
        s.interactive = true;
        s.buttonMode = true;
        s.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        tileSelectorContainer.addChild(s);
    })



    const graphicsOuter = new PIXI.Graphics();
    const graphicsInner = new PIXI.Graphics();
    // Circle
    graphicsOuter.lineStyle(0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
    graphicsOuter.beginFill(0x333333, 1);
    graphicsOuter.drawRect(tileSelectorContainer.x, tileSelectorContainer.y, 100, 400);
    graphicsOuter.endFill();

    // Circle + line style 1
    graphicsInner.lineStyle(2, 0xFEEB77, 1);
    graphicsInner.beginFill(0x1050bb, 1);
    graphicsInner.drawRect(tileSelectorContainer.x, tileSelectorContainer.y, 100, 400);
    graphicsInner.interactive = true;
    graphicsInner.buttonMode = true;
    graphicsInner.endFill();

    tileSelectorContainer.addChild(graphicsOuter);
    tileSelectorContainer.addChild(graphicsInner);

    uiContainer.addChild(tileSelectorContainer);

    return tileSelectorContainer;
}


function zoomIn(object) {
    object.scale.set(object.scale.x * 1.5, object.scale.y * 1.5)
}


function zoomOut(object) {
    object.scale.set(object.scale.x * 0.5, object.scale.y * 0.5)
}


function scaleContainer(event, delta) {
    console.log(delta)
    this.scale = container.scale + delta * 100
}


function onWheel(object) {
    object.scale *= 2;
}


function onMiddleClick(object) {
    console.log('Hey! You middle clicked me!');
}


function onDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.zIndex = 1;
    this.data = event.data;

    console.log(this.data)
    this.alpha = 0.5;
    this.dragging = true;
}


function onDragEnd() {
    this.zIndex = 1;
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
}


function onDragMove() {
    if (this.dragging) {
        this.zIndex = 1;
        const newPosition = this.data.getLocalPosition(this.parent);
        console.log(newPosition)
        this.x = newPosition.x;
        this.y = newPosition.y;
    }
}


function debug() {
    console.warn('debugging...');
}


function sandbox() {

    const tileSelectorContainer = new PIXI.Container();

    //Testing Masking...
    // Create the application helper and add its render target to the page
    let app = new PIXI.Application({ width: 640, height: 360 });
    document.body.appendChild(app.view);

    const textures = 
    [
        "deepstonebrickfloor",
        "deepstonefloor","deepstonetiledfloor","dungeonfloor","grass","pinefloor",
        "sandstonebrickfloor","sandstonefloor","snowstonebrickfloor",
        "snowstonefloor","stonebrickfloor","stonefloor","stonetiledfloor",
        "strawtile","swampstonebrickfloor","swampstonefloor","water"
    ];


    const texturesObj = {};

    textures.forEach(tx => {
        const path = `assets/tiles/${tx}.png`;
        texturesObj[tx] = PIXI.Texture.from(path)
    })



    // Create window frame
    let frame = new PIXI.Graphics();
    frame.beginFill(0x666666);
    frame.lineStyle({ color: 0xffffff, width: 4, alignment: 0 });
    frame.drawRect(0, 0, 208, 208);
    frame.position.set(320 - 100, 180 - 100);
    app.stage.addChild(frame);

    // Create a graphics object to define our mask
    let mask = new PIXI.Graphics();
    // Add the rectangular area to show
    mask.beginFill(0xffffff);
    mask.drawRect(0, 0, 184, 184);
    mask.endFill();

    // Add container that will hold our masked content
    let maskContainer = new PIXI.Container();
    // Set the mask to use our graphics object from above
    maskContainer.mask = mask;
    // Add the mask as a child, so that the mask is positioned relative to its parent
    maskContainer.addChild(mask);
    // Offset by the window's frame width
    maskContainer.position.set(12, 12);
    // And add the container to the window!
    frame.addChild(maskContainer);

    let count = 0;
    const firstX = mask.x;
    const firstY = mask.y;
    let previousX = firstX;
    let rowY = firstY;
    const tileRes = 32;

    for(let t of Object.keys(texturesObj)){
        console.log(rowY)
        let s = new PIXI.Sprite(texturesObj[t]);
        s.anchor.set(0);
        if(previousX >= firstX + (tileRes * 4)){
            // console.log('resetting Y...')
            previousX = firstX;
            rowY += tileRes + 12;
            console.log(rowY)
        }
        if(previousX == firstX){
            // console.log(`rowStart x: ${previousX}`)
            // console.log(`rowStart y: ${rowY}`)
            s.x = previousX;
            s.y = rowY;
            previousX += tileRes;
        }else{
            // console.log(`col x: ${previousX}`)
            // console.log(`col y: ${rowY}`)
            s.x = previousX + 12;
            s.y = rowY;
            previousX += tileRes + 12;
        }
        
        s.interactive = true;
        s.buttonMode = true;
        s.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        tileSelectorContainer.addChild(s);
        count++;
        
        console.warn(`added\n${t}\nat ${s.x}, ${s.y}`)
        
    };

    maskContainer.addChild(tileSelectorContainer)

    console.warn(`added ${count} textures...`)

    // Add a ticker callback to scroll the text up and down
    let elapsed = 0.0;
    app.ticker.add((delta) => {
        // Update the text's y coordinate to scroll it
        elapsed += delta;
        maskContainer.children.forEach((c, i) => {
            if (i > 0){
                c.y = 10 + -100.0 + Math.cos(elapsed / 50.0) * 100.0;
            }
            
        })
        
    });
}



// THIS!!!
if (onMain) {
    main();
} else if (onDebug) {
    debug();
} else if (onSandbox) {
    sandbox();
}

