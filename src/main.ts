import Renderer from "./graphics/renderer";
import { Controller } from './ui/controller'

import "./style.css"

async function main() {
    
    const controller: Controller = Controller.getInstance();
    controller.bindEvents();

    const renderer: Renderer = Renderer.getInstance();
    
    let previous = 0;

    const roopAnimation = (current: number) => {
        const deltaTime = (current - previous) * 0.001;
        previous = current;

        renderer.update(controller.renderingStates, deltaTime);

        renderer.render(controller.renderingStates);

        requestAnimationFrame(roopAnimation);
    }

    const startLoop: boolean = await renderer.setup();
    if (startLoop)
    {
        requestAnimationFrame(roopAnimation);
    }
}

main();