const THICCNESS = 60;
const SVG_PATH_SELECTOR = ["#matter-path"];
const SVG_WIDTH_IN_PX = 100;
const SVG_WIDTH_AS_PERCENT_OF_CONTAINER_WIDTH = 0.2;

const matterContainer = document.querySelector("#matter-container");

// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Body = Matter.Body,
    Svg = Matter.Svg,
    Vector = Matter.Vector,
    Vertices = Matter.Vertices;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
    element: matterContainer,
    engine: engine,
    options: {
        width: matterContainer.clientWidth,
        height: matterContainer.clientHeight,
        background: "transparent",
        wireframes: false,
        showAngleIndicator: false,
        showBounds: false
    }
});

var ground = Bodies.rectangle(
    matterContainer.clientWidth / 2,
    matterContainer.clientHeight + THICCNESS / 2,
    matterContainer.clientWidth,
    THICCNESS,
    {
        isStatic: true,
        render: { strokeStyle: 'transparent' }
    }
);

let leftWall = Bodies.rectangle(
    0 - THICCNESS / 2,
    matterContainer.clientHeight / 2,
    THICCNESS,
    matterContainer.clientHeight,
    {
        isStatic: true,
        render: { strokeStyle: 'transparent' }
    }
);

let rightWall = Bodies.rectangle(
    matterContainer.clientWidth + THICCNESS / 2,
    matterContainer.clientHeight / 2,
    THICCNESS,
    matterContainer.clientHeight,
    {
        isStatic: true,
        render: { strokeStyle: 'transparent' }
    }
);

// add all of the bodies to the world
Composite.add(engine.world, [ground, leftWall, rightWall]);

let mouse = Matter.Mouse.create(render.canvas);
let mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
});

Composite.add(engine.world, mouseConstraint);

// allow scroll through the canvas
mouseConstraint.mouse.element.removeEventListener(
    "mousewheel",
    mouseConstraint.mouse.mousewheel
);
mouseConstraint.mouse.element.removeEventListener(
    "DOMMouseScroll",
    mouseConstraint.mouse.mousewheel
);

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);
console.log(Composite.allBodies(engine.world));

// 물체를 랜덤하게 떨어뜨리는 함수
function createSvgBodiesRandomly() {
    const paths = document.querySelectorAll(SVG_PATH_SELECTOR);
    paths.forEach((path, index) => {
        const delay = Math.random() * 7000; // 0초에서 5초 사이의 무작위 시간 간격

        setTimeout(() => {
            let vertices = Svg.pathToVertices(path);
            let scaleFactor = (matterContainer.clientWidth * SVG_WIDTH_AS_PERCENT_OF_CONTAINER_WIDTH) / SVG_WIDTH_IN_PX;
            vertices = Vertices.scale(vertices, scaleFactor, scaleFactor);
            let svgBody = Bodies.fromVertices(
                matterContainer.clientWidth * Math.random(), // 무작위 x 위치
                matterContainer.clientHeight * Math.random() / 4, // 무작위 y 위치 (상단 1/4 범위 내)
                [vertices],
                {
                    friction: 0.3,
                    frictionAir: 0.00001,
                    restitution: 0.8,
                    render: {
                        fillStyle: "#" + Math.floor(Math.random() * 16777215).toString(16), // 무작위 색상
                        strokeStyle: 'transparent',
                        lineWidth: 0
                    }
                }
            );
            Composite.add(engine.world, svgBody);
        }, delay);
    });
}

function scaleBodies() {
    const allBodies = Composite.allBodies(engine.world);

    allBodies.forEach((body) => {
        if (body.isStatic === true) return;
        const { min, max } = body.bounds;
        const bodyWidth = max.x - min.x;
        let scaleFactor = (matterContainer.clientWidth * SVG_WIDTH_AS_PERCENT_OF_CONTAINER_WIDTH) / bodyWidth;

        Body.scale(body, scaleFactor, scaleFactor);
    });
}

function handleResize(matterContainer) {
    render.canvas.width = matterContainer.clientWidth;
    render.canvas.height = matterContainer.clientHeight;

    Body.setPosition(
        ground,
        Vector.create(matterContainer.clientWidth / 2, matterContainer.clientHeight + THICCNESS / 2)
    );

    Body.setPosition(
        rightWall,
        Vector.create(matterContainer.clientWidth + THICCNESS / 2, matterContainer.clientHeight / 2)
    );

    scaleBodies();
}

window.addEventListener("resize", () => handleResize(matterContainer));

// 물체를 랜덤하게 떨어뜨리기 시작
createSvgBodiesRandomly();